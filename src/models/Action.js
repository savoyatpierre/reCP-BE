const mongoose = require("mongoose");

const ActionSchema = mongoose.Schema(
  {
    schema: { type: String },
    actionid: { type: String, required: true, unique: true },
    duedate: { type: Date, required: true },
    name: { type: String },
    reminder: { type: String },
    done: { type: Boolean },
    for: { type: [String] },
    recurrenceid: { type: String },
    recurrencedate: { type: Date },
  },
  { strict: true }
);

module.exports = mongoose.model("Action", ActionSchema);
