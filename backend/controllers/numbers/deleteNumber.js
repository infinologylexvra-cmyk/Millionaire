const NumberModel = require('../../models/Number');
const { success, error } = require('../../helpers/response');

const deleteNumber = async (req, res, next) => {
  try {
    const number = await NumberModel.findByIdAndDelete(req.params.id);

    if (!number) {
      return error(res, 404, 'Number not found');
    }

    return success(res, 200, 'Number deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = deleteNumber;
