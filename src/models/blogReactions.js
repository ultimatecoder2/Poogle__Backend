const mongoose = require("mongoose");

const blogReactionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	blog: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Blog",
	},
	category: {
		type: String,
		required: true
	}
});

const BlogReactions = mongoose.model(
	"BlogReaction",
	blogReactionSchema
);
module.exports = BlogReactions;