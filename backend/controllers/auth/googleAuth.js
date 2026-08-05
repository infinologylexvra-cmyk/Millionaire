const { OAuth2Client } = require('google-auth-library');
const User = require('../../models/User');
const { error } = require('../../helpers/response');
const { sendTokenResponse } = require('../../helpers/generateToken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return error(res, 401, 'Invalid Google token');
    }

    let user = await User.findOne({ $or: [{ googleId: payload.sub }, { email: payload.email }] });

    const isFromAdminPortal = Boolean(req.headers.referer && req.headers.referer.includes('/admin'));

    if (user) {
      if (user.isActive === false) {
        return error(res, 403, 'Your account has been deactivated by administrator. Please contact support.');
      }
      if (!user.googleId) {
        user.googleId = payload.sub;
        user.authProvider = 'google';
        user.isVerified = true;
      }
      if (isFromAdminPortal && user.role !== 'admin') {
        user.role = 'admin';
      }
    } else {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        avatar: payload.picture,
        authProvider: 'google',
        isVerified: true,
        role: isFromAdminPortal ? 'admin' : 'user',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    sendTokenResponse(user, 200, res, 'Logged in with Google successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = googleAuth;
