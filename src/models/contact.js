const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email is invalid");
				}
			},
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
		
	},
	{ timestamps: true }
);



const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;