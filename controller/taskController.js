const taskService = require("../services/taskService");

/**
 * Create a new task for the authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const taskCreate = async (req, res, next) => {
  try {
    // Extract the userId from the authenticated user's request object
    const { _id: userId } = req.user;

    // Call the taskService to create a new task
    const task = await taskService.createTask(userId);

    // Respond with a success message and the created task
    res.status(200).json({
      status: "success",
      message: "Task created successfully!",
      task,
    });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

/**
 * Get all tasks associated with the authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>}
 */
const getAllTask = async (req, res, next) => {
  try {
    // Extract the userId from the authenticated user's request object
    const userId = req.user._id;

    // Call the taskService to fetch all tasks associated with the user
    const tasks = await taskService.getAllTask(userId);

    // Respond with the array of tasks
    res.status(200).json(tasks);
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;

    const task = await taskService.getTask(taskId);

    // Respond with the array of tasks
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const taskUpdate = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const data = req.body;
    const task = await taskService.taskUpdate(taskId, data);

    // Respond with the array of tasks
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = { taskCreate, getTask, getAllTask, taskUpdate };
