const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
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

const Blogs = mongoose.model("Blog", blogSchema);
module.exports = Blogs;
