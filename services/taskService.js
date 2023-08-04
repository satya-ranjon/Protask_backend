const AppError = require("../utils/AppError");
const Task = require("../models/taskModel");

/**
 * Create a new task for a user.
 *
 * @param {string} userId - The ID of the user creating the task.
 * @param {string} name - The name of the task.
 * @param {string} description - The description of the task.
 * @param {Array<string>} tags - An array of tags associated with the task.
 * @param {Array<string>} assignedUsers - An array of user IDs to whom the task is assigned.
 * @param {string} status - The status of the task. Possible values: 'start', 'inprogress', 'onhold', 'done'.
 * @returns {Promise<Object>} The saved task object.
 * @throws {AppError} If the task name is not provided or an error occurs during the process.
 */
const createTask = async (
  userId,
  name,
  description,
  tags,
  assignedUsers,
  status
) => {
  try {
    // Check if the task name is provided
    if (!name) {
      throw new AppError("Task Name is required", 400);
    }

    // Create a new Task instance with the provided data
    const newTask = new Task({
      userId: userId,
      name: name,
      description: description,
      tags: tags,
      assignedUsers: assignedUsers,
      status: status,
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

    // Return the saved task object
    return savedTask;
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError(
        "Failed to create the task. Please try again later.",
        500
      );
    }
  }
};

/**
 * Get all tasks associated with a user.
 *
 * @param {string} userId - The ID of the user to fetch tasks for.
 * @returns {Promise<Array>} An array of tasks associated with the user.
 * @throws {AppError} If an error occurs during the process.
 */
const getAllTask = async (userId) => {
  try {
    // Find all tasks associated with the provided userId, including tasks where the user is assigned
    const tasks = await Task.find({
      $or: [{ userId: userId }, { assignedUsers: userId }],
    })
      .populate("assignedUsers", "avatar name email")
      .populate("userId", "avatar name email");

    // Return the array of tasks
    return tasks;
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Failed to fetch tasks. Please try again later.", 500);
    }
  }
};

module.exports = { createTask, getAllTask };
