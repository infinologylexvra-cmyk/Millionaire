const User = require('../../models/User');
const { success } = require('../../helpers/response');

const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    return success(res, 200, 'Wishlist fetched', user.wishlist);
  } catch (err) {
    next(err);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: req.params.numberId } },
      { new: true }
    ).populate('wishlist');

    return success(res, 200, 'Added to wishlist', user.wishlist);
  } catch (err) {
    next(err);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: req.params.numberId } },
      { new: true }
    ).populate('wishlist');

    return success(res, 200, 'Removed from wishlist', user.wishlist);
  } catch (err) {
    next(err);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
