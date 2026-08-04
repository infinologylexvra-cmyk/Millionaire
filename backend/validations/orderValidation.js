const { body, validationResult } = require('express-validator');
const { error } = require('../helpers/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation failed', errors.array().map((e) => e.msg));
  }
  next();
};

const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*').isMongoId().withMessage('Each item must be a valid number ID'),
  body('customerDetails.fullName').notEmpty().withMessage('Full name is required'),
  body('customerDetails.email').isEmail().withMessage('Please provide a valid email'),
  body('customerDetails.phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
  body('customerDetails.address').notEmpty().withMessage('Address is required'),
  body('customerDetails.city').notEmpty().withMessage('City is required'),
  body('customerDetails.state').notEmpty().withMessage('State is required'),
  body('customerDetails.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  body('couponCode').optional().isString().withMessage('Coupon code must be a string'),
];

module.exports = { validate, createOrderValidation };
