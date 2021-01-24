const mongoose = require("mongoose");

const answerReactionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	answer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Answer",
    },
    category: {
		type: String,
		required: true
	}
});

const AnswerReactions = mongoose.model("AnswerReaction", answerReactionSchema);
module.exports = AnswerReactions;

// Reaction is an upvote, downvote, and views.
