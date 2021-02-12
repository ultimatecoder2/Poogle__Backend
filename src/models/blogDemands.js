const mongoose = require("mongoose");

const blogDemandSchema = new mongoose.Schema(
	{
		title: {
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
				type: [String],
				required: true,
			},
		],
	},
	{ timestamps: true }
);

const BlogDemands = mongoose.model("BlogDemand", blogDemandSchema);
module.exports = BlogDemands;
