const { body, validationResult } = require('express-validator');
const { error } = require('../helpers/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, 'Validation failed', errors.array().map((e) => e.msg));
  }
  next();
};

const createCategoryValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
];

module.exports = { validate, createCategoryValidation, updateCategoryValidation };
