const express = require("express");
const { createEvent } = require("../controller/eventController");

const router = express.Router();

router.post("/", createEvent);

module.exports = router;
