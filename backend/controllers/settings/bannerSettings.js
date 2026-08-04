const Banner = require('../../models/Banner');
const { success, error } = require('../../helpers/response');

const getBanners = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };

    const banners = await Banner.find(filter).sort({ order: 1 });

    return success(res, 200, 'Banners fetched', banners);
  } catch (err) {
    next(err);
  }
};

const createBanner = async (req, res, next) => {
  try {
    if (req.file) req.body.image = req.file.path;

    const banner = await Banner.create(req.body);

    return success(res, 201, 'Banner created successfully', banner);
  } catch (err) {
    next(err);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    if (req.file) req.body.image = req.file.path;

    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return error(res, 404, 'Banner not found');
    }

    return success(res, 200, 'Banner updated successfully', banner);
  } catch (err) {
    next(err);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return error(res, 404, 'Banner not found');
    }

    return success(res, 200, 'Banner deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = { getBanners, createBanner, updateBanner, deleteBanner };
