const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    starttime: {
      hour: { type: Number, required: true },
      minute: { type: Number, required: true },
    },
    endtime: {
      hour: { type: Number, required: true },
      minute: { type: Number, required: true },
    },
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
