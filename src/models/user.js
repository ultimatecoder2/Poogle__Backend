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
			field: {
				type: String,
				trim: true,
			},
			graduation_year: {
				type: String, // as we don't need to perform any kind of arithmetic
				trim: true,
			},
		},
		interests: [
			{
				interest: {
					type: String,
					unique:true
				},
				voteCount: {
					type: Number,
					default: 0,
					min: 0,
				},
			},
		],
		image: {
			type: Buffer,
		},
		tokens: [
			{
				// an array to store all the login tokens of the user
				token: {
					type: String,
					required: true,
				},
			},
		],
		questions: [
			{
				question: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Question",
				},
			},
		],
		answers: [
			{
				answer: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Answer",
				},
			},
		],
		blogs: [
			{
				blog: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Blog",
				},
			},
		],
	},
	{ timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, "thisisthesecrettoken");

	//Saving tokens in user so as he can login over multiple devices and we can keep a track of that.
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	delete userObject.image;
	return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({
		email,
	});
	if (!user) {
		throw new Error("Unable to login");
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Unable to login");
	}
	return user;
};

//Called just before saving. Used to hash the password
userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
