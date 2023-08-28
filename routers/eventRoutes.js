const express = require("express");
const { createEvent, updateEvent } = require("../controller/eventController");
const validateEventInput = require("../middleware/validateEventInput");

const router = express.Router();

router.post("/", validateEventInput, createEvent);
router.patch("/:eventId", validateEventInput, updateEvent);

module.exports = router;
