const express = require("express");
const {
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controller/eventController");
const validateEventInput = require("../middleware/validateEventInput");

const router = express.Router();

router.post("/", validateEventInput, createEvent);
router.patch("/:eventId", validateEventInput, updateEvent);
router.delete("/:eventId", deleteEvent);

module.exports = router;
