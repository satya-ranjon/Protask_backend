const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dcpbu1ffy",
  api_key: "292711678397456",
  api_secret: "dUNmk-A3RBhIBoIvk24ef6-piNo",
});

// Function to upload an image to Cloudinary with specified dimensions
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

// Function to delete an image from Cloudinary
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
