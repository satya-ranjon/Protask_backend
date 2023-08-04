const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Tags = mongoose.model("Tags", tagSchema);

module.exports = Tags;
