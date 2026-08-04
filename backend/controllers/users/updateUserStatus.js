const User = require('../../models/User');
const { success, error } = require('../../helpers/response');

const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;

    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (role !== undefined) updates.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) {
      return error(res, 404, 'User not found');
    }

    return success(res, 200, 'User updated successfully', user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

module.exports = updateUserStatus;
