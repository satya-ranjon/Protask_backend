const Event = require("../models/eventModel");

const createEvent = async (data) => {
  const newEvent = new Event(data);
  const savedEvetnt = await newEvent.save();
  return savedEvetnt;
};

module.exports = { createEvent };
