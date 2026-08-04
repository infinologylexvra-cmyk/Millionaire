const { success } = require('../../helpers/response');

const getMe = async (req, res, next) => {
  try {
    success(res, 200, 'Current user', req.user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

module.exports = getMe;
