const User = require('../../models/User');
const { success, error } = require('../../helpers/response');
const { sendOTPEmail } = require('../../services/emailService');

const GENERIC_MESSAGE = 'If an account exists with this email, an OTP has been sent';

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return success(res, 200, GENERIC_MESSAGE);
    }

    if (user.authProvider === 'google') {
      return error(res, 400, 'This account uses Google sign-in and has no password to reset');
    }

    const otp = user.generateOTP();
    await user.save();

    await sendOTPEmail(user.email, otp, user.name).catch(() => {});

    success(res, 200, GENERIC_MESSAGE);
  } catch (err) {
    next(err);
  }
};

module.exports = forgotPassword;
