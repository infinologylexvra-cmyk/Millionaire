const NumberModel = require('../../models/Number');
const Order = require('../../models/Order');
const Coupon = require('../../models/Coupon');
const { success, error } = require('../../helpers/response');

const createOrder = async (req, res, next) => {
  try {
    const { items, customerDetails, couponCode } = req.body;

    const numbers = await NumberModel.find({
      _id: { $in: items },
      isActive: true,
      isSold: false,
    });

    if (numbers.length !== items.length) {
      const foundIds = numbers.map((n) => n._id.toString());
      const unavailable = items.filter((id) => !foundIds.includes(id));
      return error(res, 409, 'One or more selected numbers are no longer available', unavailable);
    }

    // No longer checking for isReserved, numbers remain available until sold

    const subtotal = numbers.reduce((sum, n) => sum + n.price, 0);

    let discount = 0;
    let couponDoc = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon) {
        return error(res, 404, 'Invalid coupon code');
      }
      const { valid, reason } = coupon.isValid(subtotal);
      if (!valid) {
        return error(res, 400, reason);
      }
      discount = coupon.calculateDiscount(subtotal);
      couponDoc = coupon;
    }

    const totalAmount = subtotal - discount;

    const order = await Order.create({
      user: req.user._id,
      items: numbers.map((n) => ({ number: n._id, phoneNumber: n.phoneNumber, price: n.price })),
      subtotal,
      discount,
      coupon: couponDoc ? couponDoc._id : null,
      totalAmount,
      customerDetails,
      paymentMethod: req.body.paymentMethod || 'direct_upi',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order created' }],
    });

    // No longer marking numbers as reserved/locked by this user

    return success(res, 201, 'Order created successfully', order);
  } catch (err) {
    next(err);
  }
};

module.exports = createOrder;
