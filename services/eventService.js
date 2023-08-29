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

/**
 * Delete an event by its ID.
 * @param {string} id - ID of the event to delete.
 * @returns {Promise<Object>} - A message confirming successful deletion.
 */
const deleteEvent = async (id) => {
  try {
    // Use findByIdAndDelete to remove the event by its ID
    const event = await Event.findByIdAndDelete(id);

    if (event) {
      return { message: "Event deleted successfully" };
    }
    return { message: "Event already deleted" };
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error; // Re-throw custom AppError for expected errors
    } else {
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Retrieves events grouped by date for a given user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} - An object where keys are dates and values are arrays of events.
 * @throws {AppError} - If an error occurs during the process.
 */
const getEventsGroupedByDate = async (userId) => {
  try {
    // Fetch events from the database for the specified user
    const events = await Event.find({ userId });

    // Group events by date using the reduce() method
    const eventsGroupedByDate = events.reduce((acc, cur) => {
      if (!acc[cur.date]) {
        // to store events for that date
        acc[cur.date] = [];
      }
      // Push the current event into the array corresponding to its date
      acc[cur.date].push(cur);
      return acc;
    }, {});

    // Return the object containing events grouped by date
    return eventsGroupedByDate;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      // Re-throw custom AppError for expected errors
      throw error;
    } else {
      // Throw a generic AppError for unexpected errors
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsGroupedByDate,
};
