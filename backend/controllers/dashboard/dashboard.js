const User = require('../../models/User');
const NumberModel = require('../../models/Number');
const Order = require('../../models/Order');
const Contact = require('../../models/Contact');
const { success } = require('../../helpers/response');

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalNumbers,
      soldNumbers,
      availableNumbers,
      totalOrders,
      pendingOrders,
      totalRevenueAgg,
      recentOrders,
      pendingContacts,
    ] = await Promise.all([
      User.countDocuments(),
      NumberModel.countDocuments(),
      NumberModel.countDocuments({ isSold: true }),
      NumberModel.countDocuments({ isSold: false, isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Contact.countDocuments({ status: 'new' }),
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    return success(res, 200, 'Dashboard stats fetched', {
      totalUsers,
      totalNumbers,
      soldNumbers,
      availableNumbers,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders,
      pendingContacts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getDashboardStats;
