const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const upload = require('../../middleware/upload');
const {
  validate,
  createCategoryValidation,
  updateCategoryValidation,
} = require('../../validations/categoryValidation');

const getCategories = require('../../controllers/categories/getCategories');
const createCategory = require('../../controllers/categories/createCategory');
const updateCategory = require('../../controllers/categories/updateCategory');
const deleteCategory = require('../../controllers/categories/deleteCategory');

const attachImage = (req, res, next) => {
  if (req.file) req.body.image = req.file.path;
  next();
};

router.get('/', getCategories);
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  attachImage,
  createCategoryValidation,
  validate,
  createCategory
);
router.put(
  '/:id',
  protect,
  admin,
  upload.single('image'),
  attachImage,
  updateCategoryValidation,
  validate,
  updateCategory
);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
