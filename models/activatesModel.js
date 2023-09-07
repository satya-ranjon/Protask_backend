const mongoose = require("mongoose");

const activateSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    type: { type: String },
    title: { type: String },
    activateId: { type: String },
    dis: [
      {
        bold: { type: Boolean },
        text: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Activate = mongoose.model("Activate", activateSchema);

module.exports = Activate;
