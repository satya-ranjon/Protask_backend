const uploadPicture = require("../middleware/multerHandleProfilePicture");
const User = require("../models/userModel");
const {
  uploadImage,
  deleteImageFromCloudinary,
} = require("../services/cloudinaryService");
const userService = require("../services/userService");
const removeRsUnDataFormUser = require("../utils/removeRsUnDataFormUser");

/**
 * Register a new user.
 * @param {Object} req - Express request object containing user data in the request body.
 * @param {Object} res - Express response object to send the registration response.
 * @param {Function} next - Express next middleware function for error handling.
 * @returns {void}
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Call the userService.registerUser function to handle user registration
    const user = await userService.registerUser(name, email, password);

    // Send a success response with the newly registered user data
    res.status(201).json({
      status: "success",
      message: "User registered successfully!",
      ...user,
    });
  } catch (err) {
    // Pass the error to the next middleware for centralized error handling
    next(err);
  }
};

/**
 * Log in an existing user.
 * @param {Object} req - Express request object containing user login data in the request body.
 * @param {Object} res - Express response object to send the login response.
 * @param {Function} next - Express next middleware function for error handling.
 * @returns {void}
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Call the userService.loginUser function to handle user login
    const user = await userService.loginUser(email, password);

    // Send a success response with the generated token
    res.status(200).json({
      status: "success",
      message: "User logged in successfully!",
      ...user,
    });
  } catch (err) {
    // Pass the error to the next middleware for centralized error handling
    next(err);
  }
};

/**
 * Get the user profile based on the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */

const userProfile = async (req, res, next) => {
  try {
    // Fetch the user profile data based on the authenticated user ID
    const userProfileData = await userService.userProfile(req.user._id);

    // Respond with the user profile data
    res.status(200).json(userProfileData);
  } catch (err) {
    // Pass the error to the next error-handling middleware
    next(err);
  }
};

/**
 * Handles the profile update for a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const profileUpdate = async (req, res, next) => {
  try {
    // The result 'updateInfo' should contain the updated user information.
    const updateInfo = await userService.profileUpdate(req.user._id, req.body);

    // Respond with the user update profile data
    res.status(200).json(updateInfo);
  } catch (err) {
    // Pass the error to the next error-handling middleware
    next(err);
  }
};

/**
 * Updates the user's password.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const passwordUpdate = async (req, res, next) => {
  try {
    // Call the userService.passwordUpdate function to update the user's password
    const message = await userService.passwordUpdate(
      req.user._id,
      req.body.newPassword,
      req.body.oldPassword
    );

    // Respond with a success message after successfully updating the password
    res.status(200).json(message);
  } catch (err) {
    // Pass any errors that occur during the process to the next error-handling middleware
    next(err);
  }
};

/**
 * Update Profile Picture
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const profilePictureUpdate = (req, res, next) => {
  // Upload the profile picture using the multer middleware
  uploadPicture.single("profilePicture")(req, res, async (err) => {
    try {
      if (err) {
        // If there's an error during file upload, pass it to the error handling middleware
        return next(err);
      }

      // Get the user ID from the request
      const userId = req.user._id;

      // Fetch the user data from the database using the user ID
      const user = await User.findById(userId);

      // Get the public IDs of the user's existing profile pictures
      const oldPublicId64 = user.avatar["64"].public_id;
      const oldPublicId200 = user.avatar["200"].public_id;

      // Delete the old profile pictures from Cloudinary if they exist
      if (oldPublicId64) {
        await deleteImageFromCloudinary(oldPublicId64);
      }
      if (oldPublicId200) {
        await deleteImageFromCloudinary(oldPublicId200);
      }

      // Upload image with dimensions 64*64
      const avater64 = await uploadImage(req.file.buffer, 64, 64);
      const newAvaterURL64 = avater64.secure_url;
      const newPublicId64 = avater64.public_id;

      // Upload image with dimensions 200*200
      const avater200 = await uploadImage(req.file.buffer, 200, 200);
      const newAvaterURL200 = avater200.secure_url;
      const newPublicId200 = avater200.public_id;

      // Update the user's avatar data in the user object
      user.avatar = {
        64: {
          url: newAvaterURL64,
          public_id: newPublicId64,
        },
        200: {
          url: newAvaterURL200,
          public_id: newPublicId200,
        },
      };

      // Save the updated user information to the database
      const updateInfo = await user.save();

      // Respond with the updated user data without sensitive information
      res.status(200).json(removeRsUnDataFormUser(updateInfo));
    } catch (error) {
      // If an error occurs during the process, pass it to the error handling middleware
      next(error);
    }
  });
};

/**
 * Middleware for adding a reference to a sleipnerUser in the currently authenticated user's document.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const addSleipner = async (req, res, next) => {
  try {
    // Call the userService to add a sleipnerUser reference to the user document
    const message = await userService.addSleipner(req.user._id, req.body.id);

    // Respond with a 200 OK status and the updated user document in JSON format
    res.status(200).json(message);
  } catch (error) {
    // Pass any errors to the next middleware for error handling
    next(error);
  }
};

/**
 * Middleware for removing a sleipner reference from a user document and responding with a success message.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const deleteSlepiner = async (req, res, next) => {
  try {
    const taskId = req.params.sleipnerId;

    // Call the userService to remove a sleipner reference from the user document
    const message = await userService.deleteSlepiner(req.user._id, taskId);

    // Respond with a 200 OK status and the success message in JSON format
    res.status(200).json(message);
  } catch (error) {
    // Pass any errors to the next middleware for error handling
    next(error);
  }
};

/**
 * Search for users based on a query string.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
const userSearch = async (req, res, next) => {
  try {
    const searchQuery = req.query.nameOremail;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    // Call the user service to perform the search
    const users = await userService.userSearch(searchQuery, page, perPage);

    // Send a JSON response with the search results
    res.status(200).json(users);
  } catch (error) {
    // If an error occurs, pass it to the next middleware or error handler
    next(error);
  }
};

/**
 * Controller function to retrieve a paginated list of Sleipner documents related to the authenticated user.
 *
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @param {function} next - The next middleware function.
 */
const getAllSleipner = async (req, res, next) => {
  try {
    // Parse the query parameters for pagination, default to page 1 and 10 items per page.
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    // Call the userService to retrieve Sleipner documents with pagination options.
    const sleipners = await userService.getAllSleipner({
      id: req.user._id, // The ID of the authenticated user.
      skip: (page - 1) * perPage, // Calculate the number of documents to skip based on the page number.
      limit: perPage, // Number of documents to return per page.
    });

    // Send the retrieved Sleipner documents as a JSON response.
    res.status(200).json(sleipners);
  } catch (error) {
    // Forward any errors to the next middleware for error handling.
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  profileUpdate,
  passwordUpdate,
  profilePictureUpdate,
  addSleipner,
  deleteSlepiner,
  userSearch,
  getAllSleipner,
};
