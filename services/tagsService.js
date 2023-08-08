const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const uuid = require("uuid");

/**
 * Create a new tag for a user.
 *
 * @param {string} id - The user ID.
 * @param {string} tag - The tag to be created.
 * @returns {Promise<Object>} The saved tag object.
 * @throws {AppError} If an error occurs during the process.
 */
const createTags = async (id, data) => {
  try {
    // Create a new Tags instance with the provided tag and userId
    const user = await User.findById(id);

    // Generate a unique ID for the new tag
    const tagId = uuid.v4();
    const newTag = { id: data.id || tagId, name: data.name, color: data.color };
    user.tags.push(newTag);

    // Save the new tag to the database
    await user.save();

    // Return the saved tag
    return newTag;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Delete a tag from the user's tags array.
 *
 * @param {string} userId - The ID of the user whose tag is being deleted.
 * @param {string} tagId - The ID of the tag to be deleted.
 * @returns {Promise<{ message: string }>} A promise that resolves to an object containing a message.
 * @throws {AppError} If there is an error during the deletion process.
 */
const deleteTag = async (userId, tagId) => {
  try {
    // Find the user by id
    const user = await User.findById(userId);

    // Find the index of the tag with the specified ID
    const tagIndex = user.tags.findIndex((tag) => tag.id === tagId);

    if (tagIndex !== -1) {
      // Remove the tag from the user's tags array
      user.tags.splice(tagIndex, 1);

      // Save the updated user to the database
      await user.save();

      return { message: "Tag deleted successfully" };
    } else {
      // Return a message indicating that the tag was not found
      return { message: "Tag not found" };
    }
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
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
    const user = await User.findById(id);

    // Return the array of tags
    return user.tags;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

module.exports = { createTags, deleteTag, getAllTags };
