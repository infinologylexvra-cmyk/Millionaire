const NumberModel = require('../../models/Number');
const { success, error } = require('../../helpers/response');

const createNumber = async (req, res, next) => {
  try {
    const {
      phoneNumber,
      category,
      operator,
      circle,
      pattern,
      price,
      originalPrice,
      description,
      tags,
      isFeatured,
    } = req.body;

    const existing = await NumberModel.findOne({ phoneNumber });
    if (existing) {
      return error(res, 409, 'This phone number already exists in inventory');
    }

    const number = await NumberModel.create({
      phoneNumber,
      category,
      operator,
      circle,
      pattern,
      price,
      originalPrice,
      description,
      tags,
      isFeatured,
    });

    return success(res, 201, 'Number added successfully', number);
  } catch (err) {
    next(err);
  }
};

module.exports = createNumber;
