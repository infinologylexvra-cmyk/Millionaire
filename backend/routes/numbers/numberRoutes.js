const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const {
  validate,
  createNumberValidation,
  updateNumberValidation,
} = require('../../validations/numberValidation');

const getNumbers = require('../../controllers/numbers/getNumbers');
const getNumber = require('../../controllers/numbers/getNumber');
const searchNumber = require('../../controllers/numbers/searchNumber');
const createNumber = require('../../controllers/numbers/createNumber');
const updateNumber = require('../../controllers/numbers/updateNumber');
const deleteNumber = require('../../controllers/numbers/deleteNumber');

router.get('/', getNumbers);
router.get('/search/suggest', searchNumber);
router.get('/:id', getNumber);
router.post('/', protect, admin, createNumberValidation, validate, createNumber);
router.put('/:id', protect, admin, updateNumberValidation, validate, updateNumber);
router.delete('/:id', protect, admin, deleteNumber);

module.exports = router;
