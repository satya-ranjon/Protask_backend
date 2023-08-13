const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      userId: String,
      name: String,
      avatar: String,
      email: String,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    description: [],
    tags: [
      {
        id: String,
        name: String,
        color: String,
      },
    ],
    assignedUsers: [
      {
        userId: String,
        name: String,
        avatar: String,
        email: String,
      },
    ],
    status: {
      type: String,
      enum: ["Start", "In Process", "On Hold", "Done"],
      default: "Start",
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
