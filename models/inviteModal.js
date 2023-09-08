const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  senderEmail: String,
  recipientEmail: String,
  message: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const Invite = mongoose.model("Invite", inviteSchema);

module.exports = Invite;
