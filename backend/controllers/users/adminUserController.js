const User = require('../../models/User');
const { success, error } = require('../../helpers/response');

/**
 * POST /api/users
 * Admin creates a new user or admin account
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return error(res, 400, 'Name, email, and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, 409, 'User with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: role === 'admin' ? 'admin' : 'user',
      authProvider: 'local',
      isVerified: true,
      isActive: true,
    });

    return success(res, 201, 'Account created successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/:id
 * Admin updates user/admin details (name, email, password, phone, role, isActive)
 */
const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return error(res, 404, 'User not found');

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role && ['user', 'admin'].includes(role)) user.role = role;
    if (isActive !== undefined) user.isActive = Boolean(isActive);

    if (password && password.trim().length >= 6) {
      user.password = password.trim();
    }

    await user.save();

    return success(res, 200, 'User updated successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/users/:id
 * Admin deletes a user/admin account
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, 404, 'User not found');

    if (user._id.toString() === req.user._id.toString()) {
      return error(res, 400, 'You cannot delete your own logged-in admin account');
    }

    await User.findByIdAndDelete(req.params.id);
    return success(res, 200, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, updateUser, deleteUser };
