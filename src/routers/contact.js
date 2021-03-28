const express = require("express");
const Contact = require("../models/contact");
const router = new express.Router();

//Contact
router.post("/contactUs", async (req, res) => {
	const contact = new Contact(req.body);
	try {
		await contact.save();
		res.status(201).send({message:"Thanks for writing to us"});
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
