const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
	{
		user_name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
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
		password: {
			type: String,
			required: true,
			trim: true,
		},
		about: {
			description: {
				type: String,
				trim: true,
			},
			job: {
				type: String,
				trim: true,
			},
			field: {
				type: String,
				trim: true,
			},
			graduation_year: {
				type: String, // as we don't need to perform any kind of arithmetic
				trim: true,
			},
			fun_fact: {
				type: String,
				trim: true,
			},
		},
		interests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Spaces",
			},
		],
		tokens: [
			{
				// an array to store all the login tokens of the user
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
