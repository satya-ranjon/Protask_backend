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

    // Call the eventService to create the event using the provided data
    const event = await eventService.createEvent({
      title,
      description,
      date,
      starttime,
      endtime,
      sleipner,
    });

    // Respond with the created event object
    res.status(201).json(event);
  } catch (error) {
    // Handle errors gracefully
    next(error);
  }
};

module.exports = { createEvent };
