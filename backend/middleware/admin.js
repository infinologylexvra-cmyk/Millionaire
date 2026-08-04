const { error } = require('../helpers/response');

const admin = (req, res, next) => {
  if (!req.user) return error(res, 401, 'Not authorized, please log in');
  if (req.user.role !== 'admin') return error(res, 403, 'Admin access required');
  next();
};

module.exports = admin;
