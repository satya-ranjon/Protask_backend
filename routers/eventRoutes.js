const express = require("express");
const { createEvent } = require("../controller/eventController");
const validateEventInput = require("../middleware/validateEventInput");

const router = express.Router();

router.post("/", validateEventInput, createEvent);

module.exports = router;
