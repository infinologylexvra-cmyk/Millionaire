const User = require('../../models/User');
const { success } = require('../../helpers/response');
const { getPagination, buildPaginationMeta } = require('../../helpers/pagination');

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query, 20);
    const { search, role } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return success(res, 200, 'Users fetched', users.map((user) => user.toSafeObject()), {
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllUsers;
