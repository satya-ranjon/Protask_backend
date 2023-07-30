const express = require("express");
const { taskCreate, taskUpdate } = require("../controller/taskController");

const routes = express.Router();

routes.post("/", taskCreate);
routes.patch("/:taskId/status", taskUpdate);

module.exports = routes;
