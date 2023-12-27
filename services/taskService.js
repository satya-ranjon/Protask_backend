const AppError = require("../utils/AppError");
const Task = require("../models/taskModel");
const uuid = require("uuid");

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
const createTask = async (user) => {
  try {
    const descId = uuid.v4();
    // Create a new Task instance with the provided data
    const newTask = new Task({
      user: user._id,
      description: [
        {
          id: descId,
          type: "paragraph",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
          },
          content: [],
          children: [],
        },
      ],
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

    // Fetch the saved task with populated user and assigned user data
    const populatedTask = await Task.findById(savedTask._id)
      .populate("user", "name email avatar _id")
      .populate("assignedUsers", "name email avatar _id")
      .exec();

    // Return the saved task with populated data
    return populatedTask;
  } catch (error) {
    console.log(error);
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
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
      $or: [{ user: userId }, { assignedUsers: userId }],
    })
      .populate("user", "name email avatar _id")
      .populate("assignedUsers", "name email avatar _id")
      .exec();

    // Return the array of tasks
    return tasks;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Failed to fetch tasks. Please try again later.", 500);
    }
  }
};

/**
 * Get a task by its ID and return the task with populated user and assigned user data.
 *
 * @param {string} taskId - The ID of the task to retrieve.
 * @returns {Promise<Object>} The retrieved task object with populated user and assigned user data.
 * @throws {AppError} If there is an application-specific error.
 */
const getTask = async (taskId) => {
  try {
    // Find the task by its ID and populate user and assigned user data
    const task = await Task.findById(taskId)
      .populate("user", "name email avatar _id")
      .populate("assignedUsers", "name email avatar _id")
      .exec();

    return task;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic error
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Update a task with the provided data.
 *
 * @param {string} taskId - The ID of the task to be updated.
 * @param {Object} data - The data object containing fields to update the task.
 * @param {string} data.name - The updated name for the task.
 * @param {string[]} data.description - The updated description for the task.
 * @param {Object[]} data.tags - The updated tags for the task.
 * @param {string} data.tags[].id - The ID of the tag.
 * @param {string} data.tags[].name - The name of the tag.
 * @param {string} data.tags[].color - The color of the tag.
 * @param {Object[]} data.assignedUsers - The updated assigned users for the task.
 * @param {string} data.assignedUsers[].userId - The ID of the assigned user.
 * @param {string} data.status - The updated status for the task.
 * @returns {Promise<Object>} The updated task object.
 * @throws {AppError} If there is an application-specific error.
 */
const taskUpdate = async (taskId, data) => {
  try {
    // Find the task by its ID
    const task = await Task.findById(taskId);

    // Update task properties based on the provided data or keep existing values
    task.name = data.name || task.name;
    task.description = data.description || task.description;
    task.tags = data.tags || task.tags;
    task.assignedUsers = data.assignedUsers || task.assignedUsers;
    task.status = data.status || "Start";

    // Save the updated task
    const savedTask = await task.save();

    // Fetch the saved task with populated user and assigned user data
    const populatedTask = await Task.findById(savedTask._id)
      .populate("user", "name email avatar _id")
      .populate("assignedUsers", "name email avatar _id")
      .exec();

    // Return the saved task with populated data
    return populatedTask;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic error
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Delete a task by its ID and return a success message.
 *
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<Object>} An object containing a success message after deletion.
 * @throws {AppError} If there is an application-specific error.
 */
const deleteTask = async (taskId) => {
  try {
    // Find and delete the task by its ID
    await Task.findByIdAndDelete(taskId);

    // Return a success message after deletion
    return { message: "Delete Successfully" };
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic error
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

module.exports = { createTask, getAllTask, getTask, taskUpdate, deleteTask };
