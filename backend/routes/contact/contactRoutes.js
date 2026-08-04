const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/auth');
const admin = require('../../middleware/admin');

const contactUs = require('../../controllers/contact/contactUs');
const getContacts = require('../../controllers/contact/getContacts');
const updateContactStatus = require('../../controllers/contact/updateContactStatus');

router.post('/', contactUs);
router.get('/', protect, admin, getContacts);
router.put('/:id/status', protect, admin, updateContactStatus);

module.exports = router;
