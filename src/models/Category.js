const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  categoryid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Category", CategorySchema);