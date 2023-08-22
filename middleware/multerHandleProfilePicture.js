const multer = require("multer");
const AppError = require("../utils/AppError");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowedFileTypes = [".jpg", ".jpeg", ".png"];

  // Check if the file extension is in the allowed list
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes.includes(fileExtension)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new AppError(
        "Invalid file type. Only images with extensions .jpg, .jpeg, .png, and .gif are allowed.",
        400
      )
    );
  }
};

const uploadPicture = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 1,
  },
});

module.exports = uploadPicture;
