const NumberModel = require('../../models/Number');
const { success } = require('../../helpers/response');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const searchNumber = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();

    if (!q) {
      return success(res, 200, 'Numbers fetched', []);
    }

    const regex = new RegExp(escapeRegex(q), 'i');

    const numbers = await NumberModel.find({
      isActive: true,
      isSold: false,
      $or: [{ phoneNumber: regex }, { pattern: regex }],
    })
      .select('phoneNumber price pattern category')
      .populate('category', 'name')
      .limit(8);

    return success(res, 200, 'Numbers fetched', numbers);
  } catch (err) {
    next(err);
  }
};

module.exports = searchNumber;
