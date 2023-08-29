const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    starttime: { type: String, required: true },
    endtime: { type: String },
    sleipner: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
