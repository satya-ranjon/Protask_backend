const express = require("express");
const {
  taskCreate,
  getTask,
  getAllTask,
  taskUpdate,
  deleteTask,
} = require("../controller/taskController");

const router = express.Router();

router.post("/", taskCreate);
router.get("/:taskId", getTask);
router.patch("/:taskId", taskUpdate);
router.delete("/:taskId", deleteTask);
router.get("/", getAllTask);
// router.patch("/:taskId/status", taskUpdate);

module.exports = router;
