const eventService = require("../services/eventService");

const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.data);
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
};

module.exports = { createEvent };
