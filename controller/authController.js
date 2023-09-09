const Activate = require("../models/activatesModel");
const authService = require("../services/authService");
var parser = require("ua-parser-js");

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
    const message = await authService.registerUser(name, email, password);

    // Send a success response with the newly registered user data
    res.status(201).json(message);
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
    const user = await authService.loginUser(email, password);
    var { browser, os } = parser(req.headers["user-agent"]);

    if (user.user._id) {
      const activate = new Activate({
        userId: user.user._id,
        type: "login",
        title: "Login Your Account",
        dis: [
          {
            bold: true,
            text: `${os.name}-${os.version}`,
          },
          {
            bold: false,
            text: `or`,
          },
          {
            bold: true,
            text: `${browser.name}-${browser.version}`,
          },
          {
            bold: false,
            text: `login your account`,
          },
        ],
      });

      await activate.save();
    }
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
 * Handle the verification of a user's account using a verification token.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that handles the account verification process and sends a response.
 */
const accountVerify = async (req, res, next) => {
  try {
    // Extract the verification token from the request parameters
    const token = req.params.token;

    // Verify the user's account using the authService
    const message = await authService.accountVerify(token);

    // Respond with a success message
    res.status(200).json(message);
  } catch (error) {
    // Forward errors to the error handling middleware
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  accountVerify,
};
