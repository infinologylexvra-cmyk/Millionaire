const Category = require('../../models/Category');
const { success, error } = require('../../helpers/response');

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return error(res, 404, 'Category not found');
    }

    return success(res, 200, 'Category updated successfully', category);
  } catch (err) {
    next(err);
  }
};

module.exports = updateCategory;
