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
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
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

    // Return the saved task object
    return savedTask;
  } catch (error) {
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
      $or: [{ "user.userId": userId }, { "assignedUsers.userId": userId }],
    });

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

const getTask = async (taskId) => {
  try {
    const task = await Task.findById(taskId)
      .populate("assignedUsers", "avatar name email")
      .populate("user", "avatar name email");
    return task;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

const taskUpdate = async (taskId, data) => {
  try {
    const task = await Task.findById(taskId);
    task.name = data.name || task.name;
    task.description = data.description || task.description;
    task.tags = data.tags || task.tags;
    task.assignedUsers = data.assignedUsers || task.assignedUsers;
    task.status = data.status || "Start";
    const saveTask = await task.save();
    return saveTask;
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

const deleteTask = async (taskId) => {
  try {
    await Task.findByIdAndDelete(taskId);
    return { message: "Delete Successfully" };
  } catch (error) {
    // Handle errors
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

module.exports = { createTask, getAllTask, getTask, taskUpdate, deleteTask };
