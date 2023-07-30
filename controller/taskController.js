const taskService = require("../services/taskService");

/**
 * Controller function for creating a new task.
 * @param {import('express').Request} req - The Express request object containing the task data in the request body.
 * @param {import('express').Response} res - The Express response object to send the response back to the client.
 * @param {import('express').NextFunction} next - The Express next middleware function to handle errors.
 * @returns {Promise<void>}
 */
const taskCreate = async (req, res, next) => {
  try {
    // Attempt to create a new task by calling the `createTask` function from the taskService module and passing the request  as a parameter.
    const task = await taskService.createTask(req);

    // If the task creation is successful, respond with a 200 status and a JSON object containing a success message and the newly created task data.
    res.status(200).json({
      status: "success",
      message: "Task created successfully!",
      task, // The task object returned from the `createTask` function.
    });
  } catch (err) {
    // If an error occurs during task creation, pass the error to the next middleware (error handling middleware) using the `next` function.
    next(err);
  }
};

const taskUpdate = async (req, res, next) => {
  try {
    console.log(req);
  } catch (error) {
    next(error);
  }
};

module.exports = { taskCreate, taskUpdate };
