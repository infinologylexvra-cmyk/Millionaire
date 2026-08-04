const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const upload = require('../../middleware/upload');

const { getSettings, updateSettings } = require('../../controllers/settings/generalSettings');
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../../controllers/settings/bannerSettings');

router.get('/', getSettings);
router.put('/', protect, admin, updateSettings);

router.get('/banners', getBanners);
router.post('/banners', protect, admin, upload.single('image'), createBanner);
router.put('/banners/:id', protect, admin, upload.single('image'), updateBanner);
router.delete('/banners/:id', protect, admin, deleteBanner);

module.exports = router;
