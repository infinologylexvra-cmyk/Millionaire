const User = require('../../models/User');
const { success, error } = require('../../helpers/response');

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpires +password');

    if (!user || !user.verifyOTP(otp)) {
      return error(res, 400, 'Invalid or expired OTP');
    }

    user.password = password;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    success(res, 200, 'Password reset successfully. Please log in with your new password.');
  } catch (err) {
    next(err);
  }
};

module.exports = resetPassword;
