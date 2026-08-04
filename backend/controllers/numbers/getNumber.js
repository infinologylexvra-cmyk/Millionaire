const NumberModel = require('../../models/Number');
const { success, error } = require('../../helpers/response');

const getNumber = async (req, res, next) => {
  try {
    const number = await NumberModel.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('category', 'name slug icon');

    if (!number) {
      return error(res, 404, 'Number not found');
    }

    return success(res, 200, 'Number fetched', number);
  } catch (err) {
    next(err);
  }
};

module.exports = getNumber;
