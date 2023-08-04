const tagsService = require("../services/tagsService");

/**
 * Creates a new tag for the user with the provided ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const createTags = async (req, res, next) => {
  try {
    // Call the tagsService.createTags function to create a new tag for the user
    const tags = await tagsService.createTags(req.user._id, res.body.tag);

    // Respond with the created tag data
    res.status(200).json(tags);
  } catch (err) {
    // Pass any errors that occur during the process to the next error-handling middleware
    next(err);
  }
};

/**
 * Retrieves all tags associated with the user from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const getAllTags = async (req, res, next) => {
  try {
    // Call the tagsService.getAllTags function to retrieve all tags associated with the user
    const tags = await tagsService.getAllTags(req.user._id);

    // Respond with the array of tag documents associated with the user
    res.status(200).json({ tags });
  } catch (err) {
    // Pass any errors that occur during the process to the next error-handling middleware
    next(err);
  }
};

module.exports = { createTags, getAllTags };
