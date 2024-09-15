const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const CategoryidSchema = new mongoose.Schema({ categoryid: { type: String } });

const RatioSchema = new mongoose.Schema({
  user: { type: String },
  ratio: { type: Number },
});

const balanceruleSchema = mongoose.Schema(
  {
    schema: { type: String },
    balanceruleid: { type: String, required: true, unique: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date },
    categories: {
      type: [CategoryidSchema], // this means that it's an array of {categoryid: "..."}
    },
    ratio: {
      type: [RatioSchema], // this means that it's an array of {user: "...", ratio: 0.5}
    },
  },
  { strict: true }
);

balanceruleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("BalanceRule", balanceruleSchema);
