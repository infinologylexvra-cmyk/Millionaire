const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const upload = require('../../middleware/upload');

const getProfile = require('../../controllers/users/getProfile');
const updateProfile = require('../../controllers/users/updateProfile');
const changePassword = require('../../controllers/users/changePassword');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../../controllers/users/wishlist');
const { addAddress, updateAddress, deleteAddress } = require('../../controllers/users/addresses');
const getAllUsers = require('../../controllers/users/getAllUsers');
const updateUserStatus = require('../../controllers/users/updateUserStatus');
const { createUser, updateUser, deleteUser } = require('../../controllers/users/adminUserController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:numberId', protect, addToWishlist);
router.delete('/wishlist/:numberId', protect, removeFromWishlist);

router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

router.get('/', protect, admin, getAllUsers);
router.post('/', protect, admin, createUser);
router.put('/:id/status', protect, admin, updateUserStatus);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
