const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Tags = mongoose.model("Tags", tagSchema);

module.exports = Tags;
