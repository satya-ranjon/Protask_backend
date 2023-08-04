const express = require("express");
const { taskCreate, taskUpdate } = require("../controller/taskController");

const router = express.Router();

router.post("/", taskCreate);
router.patch("/:taskId/status", taskUpdate);

module.exports = router;
