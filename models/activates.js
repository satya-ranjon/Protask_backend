const mongoose = require("mongoose");

const activateSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  data: [
    {
      type: { type: String, required: true },
      title: { type: String, required: true },
      activateId: { type: String, required: true },
      dis: [
        {
          id: { type: String, required: true },
          bold: { type: Boolean, default: false },
          text: { type: String, required: true },
        },
      ],
      createdAt: { type: String, required: true },
    },
  ],
});

const Activate = mongoose.model("Activate", activateSchema);

module.exports = Activate;
