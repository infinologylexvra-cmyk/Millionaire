const Category = require('../../models/Category');
const { success, error } = require('../../helpers/response');

const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, image, startingPrice, order, isFeatured } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return error(res, 409, 'Category already exists');
    }

    const category = await Category.create({
      name,
      description,
      icon,
      image,
      startingPrice,
      order,
      isFeatured,
    });

    return success(res, 201, 'Category created successfully', category);
  } catch (err) {
    next(err);
  }
};

module.exports = createCategory;
