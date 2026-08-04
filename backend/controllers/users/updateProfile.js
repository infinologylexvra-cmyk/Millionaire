const User = require('../../models/User');
const { success } = require('../../helpers/response');

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;
    if (req.file) updates.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return success(res, 200, 'Profile updated successfully', user.toSafeObject());
  } catch (err) {
    next(err);
  }
};

module.exports = updateProfile;
