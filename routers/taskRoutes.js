const express = require("express");
const {
  taskCreate,
  getAllTask,
  taskUpdate,
} = require("../controller/taskController");

const router = express.Router();

router.post("/", taskCreate);
router.get("/", getAllTask);
router.patch("/:taskId/status", taskUpdate);

module.exports = router;
