const AppError = require("../utils/AppError");
const Task = require("../models/taskModel");

/**
 * Service function for creating a new task.
 * @param {import('express').Request} req - The Express request object containing the necessary data for task creation.
 * @returns {Promise<Object>} - A Promise that resolves to the newly created task object.
 * @throws {AppError} - If there are validation errors or other specific application errors during task creation.
 */
const createTask = async (req) => {
  try {
    // Extract the user's ID from the request object.
    const { _id } = req.user;

    // Extract the task name from the request body.
    const { name, description, tags, members, status } = req.body;

    // Validate if the task name is provided. If not, throw an AppError with a 400 status code.
    if (!name) {
      throw new AppError("Task Name is required", 400);
    }

    // Create a new Task object with the provided owner ID and task name.
    const newTask = new Task({
      owner: _id,
      name,
      description,
      tags,
      members,
      status,
    });

    // Save the new task to the database.
    const savedTask = await newTask.save();

    // Return the newly created task object.
    return savedTask;
  } catch (error) {
    // If the error is of type AppError (custom application-specific error), re-throw it to be caught in the controller's catch block.
    if (error instanceof AppError) {
      throw error;
    } else {
      // If the error is not an AppError, handle it by throwing a generic AppError with a 500 status code and a general error message.
      throw new AppError(
        "Failed to register user. Please try again later.",
        500
      );
    }
  }
};

module.exports = { createTask };
