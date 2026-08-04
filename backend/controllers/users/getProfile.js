const { success } = require('../../helpers/response');

const getProfile = async (req, res, next) => {
  try {
    return success(res, 200, 'Profile fetched', req.user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

module.exports = getProfile;
