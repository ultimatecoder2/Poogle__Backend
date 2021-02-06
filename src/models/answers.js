const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
	{
		question: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question",
		},
		description: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		dateNum: {
			type: Number,
			required: true,
		}
	},
	{ timestamps: true }
);

const Answers = mongoose.model("Answer", answerSchema);
module.exports = Answers;
