const NumberModel = require('../../models/Number');
const { success, error } = require('../../helpers/response');

const updateNumber = async (req, res, next) => {
  try {
    const number = await NumberModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!number) {
      return error(res, 404, 'Number not found');
    }

    return success(res, 200, 'Number updated successfully', number);
  } catch (err) {
    next(err);
  }
};

module.exports = updateNumber;
