const Category = require('../../models/Category');
const NumberModel = require('../../models/Number');
const { success } = require('../../helpers/response');

const getCategories = async (req, res, next) => {
  try {
    const activeOnly = req.query.all !== 'true';
    const filter = activeOnly ? { isActive: true } : {};

    const categories = await Category.find(filter).sort({ order: 1, name: 1 }).lean();

    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const numberCount = await NumberModel.countDocuments({
          category: cat._id,
          isActive: true,
          isSold: false,
        });
        return { ...cat, numberCount };
      })
    );

    return success(res, 200, 'Categories fetched', withCounts);
  } catch (err) {
    next(err);
  }
};

module.exports = getCategories;
