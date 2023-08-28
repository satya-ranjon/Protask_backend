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
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate("sleipner", "name email avatar _id")
      .exec();

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

/**
 * Update an existing event.
 * @param {Object} data - Updated event data.
 * @param {string} eventId - ID of the event to update.
 * @returns {Promise<Object>} - Updated event object.
 */
const updateEvent = async (data, eventId) => {
  try {
    // Find the event by its ID
    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError("Event Not Found!", 404);
    }

    // Update event properties with new data
    event.title = data.title || event.title;
    event.description = data.description || event.description;
    event.date = data.date || event.date;
    event.starttime = data.starttime || event.starttime;
    event.endtime = data.endtime || event.endtime;
    event.sleipner = [...event.sleipner, ...data.sleipner];

    // Save the updated event
    const updatedEvent = await event.save();

    // Populate the event with associated 'sleipner' data
    const populatedEvent = await Event.findById(updatedEvent._id)
      .populate("sleipner", "name email avatar _id")
      .exec();

    return populatedEvent;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

module.exports = { createEvent, updateEvent };
