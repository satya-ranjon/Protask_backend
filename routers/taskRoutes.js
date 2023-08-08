const express = require("express");
const {
  taskCreate,
  getTask,
  getAllTask,
  taskUpdate,
} = require("../controller/taskController");

const router = express.Router();

router.post("/", taskCreate);
router.get("/:taskId", getTask);
router.patch("/:taskId", taskUpdate);
router.get("/", getAllTask);
// router.patch("/:taskId/status", taskUpdate);

module.exports = router;
