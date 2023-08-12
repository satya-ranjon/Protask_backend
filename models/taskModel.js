const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
