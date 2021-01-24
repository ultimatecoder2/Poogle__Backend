const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		reciever: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		msg: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
