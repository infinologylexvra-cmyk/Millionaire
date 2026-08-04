const cloudinary = require('../config/cloudinary');

const uploadImage = async (filePathOrBase64, folder = 'millionaire-numbers') => {
  const result = await cloudinary.uploader.upload(filePathOrBase64, { folder });
  return { url: result.secure_url, publicId: result.public_id };
};

const deleteImage = async (publicId) => {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, deleteImage };
