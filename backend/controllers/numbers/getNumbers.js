const mongoose = require('mongoose');
const NumberModel = require('../../models/Number');
const Category = require('../../models/Category');
const { success } = require('../../helpers/response');
const { getPagination, buildPaginationMeta } = require('../../helpers/pagination');

const sortMap = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
  popular: { views: -1 },
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getNumbers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 12);
    const {
      category,
      pattern,
      operator,
      circle,
      minPrice,
      maxPrice,
      search,
      isFeatured,
      sort,
      includesSold,
    } = req.query;

    const filter = { isActive: true };

    if (includesSold !== 'true') {
      filter.isSold = false;
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const categoryDoc = await Category.findOne({ slug: category });
        if (!categoryDoc) {
          return success(res, 200, 'Numbers fetched', [], {
            pagination: buildPaginationMeta(0, page, limit),
          });
        }
        filter.category = categoryDoc._id;
      }
    }

    if (pattern) filter.pattern = pattern;
    if (operator) filter.operator = operator;
    if (circle) filter.circle = circle;
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isFeatured === 'false') filter.isFeatured = false;

    const effectiveMin = minPrice ? parseFloat(minPrice) : 2499;
    filter.price = { $gte: effectiveMin };
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);

    if (search && search.trim()) {
      const trimmed = search.trim();
      const cleanSearch = trimmed.replace(/\s+/g, '');
      const regex = new RegExp(escapeRegex(trimmed), 'i');
      const cleanRegex = new RegExp(escapeRegex(cleanSearch), 'i');
      filter.$or = [{ phoneNumber: regex }, { phoneNumber: cleanRegex }, { description: regex }, { tags: regex }];
    }

    const sortOption = sortMap[sort] || sortMap.newest;

    const [numbers, total] = await Promise.all([
      NumberModel.find(filter)
        .populate('category', 'name slug icon')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      NumberModel.countDocuments(filter),
    ]);

    return success(res, 200, 'Numbers fetched', numbers, {
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getNumbers;
