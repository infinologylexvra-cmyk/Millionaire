const { success } = require('../../helpers/response');

const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    success(res, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = logout;
