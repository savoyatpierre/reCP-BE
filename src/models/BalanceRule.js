const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

mongoose.set("debug", true);

const baseSchema = new mongoose.Schema({}, { discriminatorKey: 'type' });
const BaseModel = mongoose.model('Test', baseSchema);

const balanceruleSchema = mongoose.Schema(
	{
		schema: { type: String },
		balanceruleid: { type: String, required: true, unique: true },
		startdate: { type: Date, required: true },
		enddate: { type: Date },
		categoryids:  [ String ],
		//userratios: {type: Map, of : Number},
	},
	{ strict: true }
);
balanceruleSchema.plugin(uniqueValidator);

const BalanceRule = BaseModel.discriminator('balancerule', balanceruleSchema);

module.exports = BalanceRule
