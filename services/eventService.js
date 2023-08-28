const Event = require("../models/eventModel");
const AppError = require("../utils/AppError");

/**
 * Create a new event and return the populated event object.
 * @param {Object} eventData - Data to create the event.
 * @returns {Promise<Object>} - Populated event object.
 */
const createEvent = async (eventData) => {
  try {
    // Create a new event instance
    const newEvent = new Event(eventData);

    // Save the new event to the database
    const savedEvent = await newEvent.save();

    // Populate the event with associated 'sleipner' data
    const populatedEvent = await savedEvent
      .populate("sleipner", "name email avatar _id")
      .execPopulate();

    return populatedEvent;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      // Re-throw the custom AppError for expected errors
      throw error;
    } else {
      // For unexpected errors, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

module.exports = { createEvent };
