const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
	{
		heading: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		tagNames: {
			type: [String],
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		dateNum: {
			type: Number,
			required: true,
		},
		tagIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Space",
			},
		],
		links: [String],
		imageUrls: [String],
	},
	{ timestamps: true }
);

const Questions = mongoose.model("Question", questionSchema);
module.exports = Questions;
