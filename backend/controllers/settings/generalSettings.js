const Settings = require('../../models/Settings');
const { success } = require('../../helpers/response');

const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    return success(res, 200, 'Settings fetched', settings);
  } catch (err) {
    next(err);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});

    const { socialLinks, stats, seo, ...rest } = req.body;

    if (socialLinks) Object.assign(settings.socialLinks, socialLinks);
    if (stats) Object.assign(settings.stats, stats);
    if (seo) Object.assign(settings.seo, seo);

    const scalarFields = [
      'siteName',
      'tagline',
      'supportEmail',
      'supportPhone',
      'whatsappNumber',
      'address',
      'maintenanceMode',
      'upiId',
      'upiName',
      'qrCodeUrl',
    ];
    scalarFields.forEach((field) => {
      if (rest[field] !== undefined) settings[field] = rest[field];
    });

    await settings.save();

    return success(res, 200, 'Settings updated successfully', settings);
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings };
