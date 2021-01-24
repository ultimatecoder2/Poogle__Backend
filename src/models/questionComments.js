const mongoose = require("mongoose");

const questionCommentSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		question: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question",
		},
		comment: {
			type: String,
			required: true,
		},
		dateNum: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const QuestionComments = mongoose.model(
	"QuestionComment",
	questionCommentSchema
);
module.exports = QuestionComments;
