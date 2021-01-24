const mongoose = require("mongoose");

const questionReactionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	question: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Question",
	},
	category: {
		type: String,
		required: true
	}
});

const QuestionReactions = mongoose.model(
	"QuestionReaction",
	questionReactionSchema
);
module.exports = QuestionReactions;

// Reaction is an upvote, downvote, and views.
