const Tags = require("../models/tagModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

/**
 * Creates a new tag for the user with the provided ID.
 * @param {string} id - The ID of the user to create the tag for.
 * @param {string} tag - The tag to create.
 * @returns {Promise<Object>} A Promise that resolves to the saved tag document.
 * @throws {AppError} If the user with the provided ID is not found, an error with a 404 status will be thrown.
 * @throws {AppError} If any other error occurs during the tag creation process, a generic error with a 500 status will be thrown.
 */
const createTags = async (id, tag) => {
  try {
    // Find the user in the database by the provided ID
    const user = await User.findById(id);
    if (!user) {
      // If the user is not found, throw a custom AppError with a 404 status
      throw new AppError(
        "User not found. Please check the provided ID or register for a new account.",
        404
      );
    }

    // Create a new Tags document with the provided tag and userId
    const newTag = new Tags({ tag, userId: id });

    // Save the new tag to the database
    const savedTag = await newTag.save();

    // Return the saved tag document
    return savedTag;
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Retrieves all tags associated with a user from the database.
 * @param {string} id - The ID of the user to retrieve tags for.
 * @returns {Promise<Array>} A Promise that resolves to an array of tag documents associated with the user.
 * @throws {AppError} If the user with the provided ID is not found, an error with a 404 status will be thrown.
 * @throws {AppError} If any other error occurs during the process, a generic error with a 500 status will be thrown.
 */
const getAllTags = async (id) => {
  try {
    // Find the user in the database by the provided ID
    const user = await User.findById(id);
    if (!user) {
      // If the user is not found, throw a custom AppError with a 404 status
      throw new AppError(
        "User not found. Please check the provided ID or register for a new account.",
        404
      );
    }

    // Find all tags associated with the user ID
    const allTags = await Tags.find({ userId: id });

    // Return the array of tag documents associated with the user
    return allTags;
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

module.exports = { createTags, getAllTags };
