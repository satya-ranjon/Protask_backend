const cloudinary = require("cloudinary").v2;

// Initialize Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary with specified dimensions.
 *
 * @param {Buffer} buffer - The image buffer to upload.
 * @param {number} width - The desired width of the uploaded image.
 * @param {number} height - The desired height of the uploaded image.
 * @returns {Promise<object>} - A Promise that resolves with the Cloudinary upload result.
 */

const uploadImage = async (buffer, width, height) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "user_profiles", width, height, crop: "fill" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
};

/**
 * Deletes an image from Cloudinary by its public ID.
 *
 * @param {string} publicId - The public ID of the image to delete.
 * @returns {Promise<void>} - A Promise that resolves when the image is successfully deleted.
 */

const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Image with public ID ${publicId} deleted from Cloudinary.`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

module.exports = { uploadImage, deleteImageFromCloudinary };
