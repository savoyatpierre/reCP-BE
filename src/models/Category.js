const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
{
schema: { type: String },
categoryid: { type: String, required: true, unique: true },
communityid: { type: String, required: true },
name: { type: String, required: true },
color: { type: String },
},
{ strict: true }
);

module.exports = mongoose.model("Category", CategorySchema);