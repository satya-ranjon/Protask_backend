const Tags = require("../models/tagModel");
const AppError = require("../utils/AppError");

/**
 * Create a new tag for a user.
 *
 * @param {string} id - The user ID.
 * @param {string} tag - The tag to be created.
 * @returns {Promise<Object>} The saved tag object.
 * @throws {AppError} If an error occurs during the process.
 */
const createTags = async (id, tag) => {
  try {
    // Create a new Tags instance with the provided tag and userId
    const newTag = new Tags({ tag, userId: id });

    // Save the new tag to the database
    const savedTag = await newTag.save();

    // Return the saved tag
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
 * Get all tags for a user.
 *
 * @param {string} id - The user ID.
 * @returns {Promise<Array>} An array of all tags associated with the user.
 * @throws {AppError} If an error occurs during the process.
 */
const getAllTags = async (id) => {
  try {
    // Find all tags associated with the provided userId
    const allTags = await Tags.find({ userId: id });

    // Return the array of tags
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
