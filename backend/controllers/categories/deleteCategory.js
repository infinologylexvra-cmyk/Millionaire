const Category = require('../../models/Category');
const NumberModel = require('../../models/Number');
const { success, error } = require('../../helpers/response');

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const numberCount = await NumberModel.countDocuments({ category: id });
    if (numberCount > 0) {
      return error(
        res,
        400,
        'Cannot delete category with existing numbers. Reassign or delete those numbers first.'
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return error(res, 404, 'Category not found');
    }

    return success(res, 200, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = deleteCategory;
