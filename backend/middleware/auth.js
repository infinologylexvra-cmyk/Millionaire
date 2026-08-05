const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { error } = require('../helpers/response');

/**
 * Protects routes - requires a valid JWT (from cookie or Authorization header)
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return error(res, 401, 'Not authorized, please log in');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return error(res, 401, 'User not found or account disabled');
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 401, 'Not authorized, token invalid or expired');
  }
};

/**
 * Attaches req.user if a valid token is present, but does not block the request otherwise
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.isActive) req.user = user;
    next();
  } catch (err) {
    next();
  }
};

module.exports = { protect, optionalAuth };
