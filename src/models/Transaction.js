const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const transactionSchema = mongoose.Schema(
  {
    schema: { type: String },
    transactionid: { type: String, required: true, unique: true },
    communityid: { type: String, required: true },
    author: { type: String },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    by: { type: String },
    for: [{ type: String }],
    categoryid: { type: String },
    tagids: {
      type: [{ tagid: String }],
    },
    type: { type: String, enum: ["expense", "revenue"] },
  },
  { strict: true }
);

transactionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Transaction", transactionSchema);
