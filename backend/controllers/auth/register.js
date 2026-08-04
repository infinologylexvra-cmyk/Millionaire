const User = require('../../models/User');
const { error } = require('../../helpers/response');
const { sendTokenResponse } = require('../../helpers/generateToken');
const { sendWelcomeEmail } = require('../../services/emailService');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, 409, 'An account with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      authProvider: 'local',
      isVerified: true,
    });

    sendWelcomeEmail(user.email, user.name).catch(() => {});

    sendTokenResponse(user, 201, res, 'Account created successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = register;
