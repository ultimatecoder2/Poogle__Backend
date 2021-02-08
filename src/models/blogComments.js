const mongoose = require("mongoose");

const blogCommentSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		blog: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
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

const BlogComments = mongoose.model(
	"BlogComment",
	blogCommentSchema
);
module.exports = BlogComments;
