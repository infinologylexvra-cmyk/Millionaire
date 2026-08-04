const express = require('express');
const { protect } = require('../../middleware/auth');
const {
  validate,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyOtpValidation,
  resetPasswordValidation,
} = require('../../validations/authValidation');

const register = require('../../controllers/auth/register');
const login = require('../../controllers/auth/login');
const googleAuth = require('../../controllers/auth/googleAuth');
const logout = require('../../controllers/auth/logout');
const forgotPassword = require('../../controllers/auth/forgotPassword');
const verifyOTP = require('../../controllers/auth/verifyOTP');
const resetPassword = require('../../controllers/auth/resetPassword');
const getMe = require('../../controllers/auth/getMe');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/google', googleAuth);
router.get('/logout', logout);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/verify-otp', verifyOtpValidation, validate, verifyOTP);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
