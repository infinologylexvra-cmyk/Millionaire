const jwt = require('jsonwebtoken');

const generateToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Signs a short-lived token, used for password reset flows
 */
const generateShortToken = (payload, expiresIn = '15m') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const cookieOptions = () => {
  const days = parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 7;
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: days * 24 * 60 * 60 * 1000,
  };
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id, user.role);

  res.cookie('token', token, cookieOptions());

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: user.toSafeObject ? user.toSafeObject() : user,
  });
};

module.exports = {
  generateToken,
  generateShortToken,
  verifyToken,
  cookieOptions,
  sendTokenResponse,
};
