const express = require("express");
const Chat = require("../models/chat");
const router = new express.Router();

// sending msgs
router;

// receiving msgs
router.get("/msgs", async (req, res) => {
	const me = req.me;
	const other = req.other;
	const start = req.query.start;
	const limit = req.query.limit;
	const chat = await Chat.find({
		$or: [
			{ sender: me, reciever: other },
			{ sender: other, reciever: me },
		],
	})
		.sort({ createdAt: "desc" })
		.limit(limit)
		.skip(start);
	res.status(200).send(chat);
});

module.exports = router;
