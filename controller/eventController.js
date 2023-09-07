const Activate = require("../models/activatesModel");
const eventService = require("../services/eventService");

/**
 * Controller function to create an event.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const createEvent = async (req, res, next) => {
  try {
    // Destructure data from the request object
    const { title, description, date, starttime, endtime, sleipner } = req.body;
    const userId = req.user._id;
    // Call the eventService to create the event using the provided data
    const event = await eventService.createEvent({
      userId,
      title,
      description,
      date,
      starttime,
      endtime,
      sleipner,
    });

    if (event._id) {
      const activate = new Activate({
        userId: userId,
        type: "event",
        title: "New Event",
        activateId: event._id,
        dis: [
          {
            bold: true,
            text: title,
          },
          {
            bold: false,
            text: `create a new event`,
          },
        ],
      });

      await activate.save();
    }

    // Respond with the created event object
    res.status(201).json(event);
  } catch (error) {
    // Handle errors gracefully
    next(error);
  }
};

/**
 * Update an existing event by its ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const updateEvent = async (req, res, next) => {
  try {
    // Extract the event ID to update from the request parameters
    const eventIdToUpdate = req.params.eventId;

    // Extract updated event data from the request body
    const { title, description, date, starttime, endtime, sleipner } = req.body;

    // Call the eventService's updateEvent function to perform the update
    const updatedEvent = await eventService.updateEvent(
      {
        title,
        description,
        date,
        starttime,
        endtime,
        sleipner,
      },
      eventIdToUpdate
    );

    if (updatedEvent._id) {
      const activate = new Activate({
        userId: req.user._id,
        type: "event",
        title: "Update Event",
        activateId: updatedEvent._id,
        dis: [
          {
            bold: true,
            text: title,
          },
          {
            bold: false,
            text: `this event is update`,
          },
        ],
      });

      await activate.save();
    }

    // Respond with the updated event object
    res.status(200).json(updatedEvent);
  } catch (error) {
    // Pass any encountered errors to the error handling middleware
    next(error);
  }
};

/**
 * Delete an event by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const deleteEvent = async (req, res, next) => {
  try {
    // Get the event ID to delete from the request parameters
    const eventIdToDelete = req.params.eventId;

    // Call the eventService's deleteEvent function to remove the event
    const message = await eventService.deleteEvent(eventIdToDelete);

    // Respond with a success message
    res.status(200).json(message);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

/**
 * Controller function to retrieve all events grouped by date for a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAllEvent = async (req, res, next) => {
  try {
    // Extract the user ID from the authenticated user's request
    const userId = req.user._id;

    // Retrieve events grouped by date using the eventService
    const events = await eventService.getEventsGroupedByDate(userId);

    // Respond with the grouped events
    res.status(200).json(events);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const event = await eventService.getEvent(eventId);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvent,
  getEvent,
};
