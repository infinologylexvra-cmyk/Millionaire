const { body, validationResult } = require('express-validator');
const { error } = require('../helpers/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation failed', errors.array().map((e) => e.msg));
  }
  next();
};

const createNumberValidation = [
  body('phoneNumber')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
  body('category').isMongoId().withMessage('Please provide a valid category'),
  body('operator')
    .isIn(['Jio', 'Airtel', 'Vi', 'BSNL'])
    .withMessage('Operator must be one of Jio, Airtel, Vi, BSNL'),
  body('pattern')
    .isIn(['VIP', 'Fancy', 'Gold', 'Silver', 'Platinum', 'Business', 'Wedding', 'Trending'])
    .withMessage('Please provide a valid pattern'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('circle').optional().isString().withMessage('Circle must be a string'),
];

const updateNumberValidation = [
  body('phoneNumber')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
  body('category').optional().isMongoId().withMessage('Please provide a valid category'),
  body('operator')
    .optional()
    .isIn(['Jio', 'Airtel', 'Vi', 'BSNL'])
    .withMessage('Operator must be one of Jio, Airtel, Vi, BSNL'),
  body('pattern')
    .optional()
    .isIn(['VIP', 'Fancy', 'Gold', 'Silver', 'Platinum', 'Business', 'Wedding', 'Trending'])
    .withMessage('Please provide a valid pattern'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('circle').optional().isString().withMessage('Circle must be a string'),
];

module.exports = { validate, createNumberValidation, updateNumberValidation };
