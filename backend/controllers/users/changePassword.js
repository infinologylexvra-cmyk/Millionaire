const User = require('../../models/User');
const { success, error } = require('../../helpers/response');

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user.password) {
      return error(res, 400, 'This account has no password set (signed in with Google)');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return error(res, 401, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return success(res, 200, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = changePassword;
