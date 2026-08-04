const User = require('../../models/User');
const { success, error } = require('../../helpers/response');
const { generateShortToken } = require('../../helpers/generateToken');

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpires');

    if (!user || !user.verifyOTP(otp)) {
      return error(res, 400, 'Invalid or expired OTP');
    }

    const resetToken = generateShortToken({ id: user._id, purpose: 'reset-password' }, '15m');

    success(res, 200, 'OTP verified', { resetToken });
  } catch (err) {
    next(err);
  }
};

module.exports = verifyOTP;
