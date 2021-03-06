const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const Spaces = require("../models/spaces");
const upload = multer();
const bodyParser = require("body-parser").json();
//Signup
router.post("/users", async (req, res) => {
	const user = new User(req.body);
	console.log(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		const Interests = user.interests;
		Interests.map(async ({ interest }) => {
			const spaceId = interest;
			let space = await Spaces.findOne({ stringId: spaceId });
			if (!space.followers) {
				space.followers = new Array();
			}
			space.followers.concat(user._id);
			try {
				space.markModified("members");
				await space.save();
				console.log("space success", spaceId);
			} catch (e) {
				console.log(e);
			}
		});

		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

//Login
router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();

		res.send({ user, token });
	} catch (e) {
		res.status(400).send("Details Mismatched");
	}
});

//Logout
router.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.send();
	} catch (e) {
		console.log("Logout error", e);
		res.status(500).send(e);
	}
});

//Logout all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
});

/*router.put('/changeInterests', auth, async (req, res, next) => {

    var newinterest = {interest:req.body.spaceId, voteCount:0};
    /*User.findByIdAndUpdate(req.body.user._id, {
        $push: { interests:  newinterest} 
    })
})*/

//get user personal details
router.get("/users/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		let user = await User.findById(req.params.id);
		const userId = req.params.id;
		const {
			user_name,
			name,
			email,
			about,
			blogs,
			answers,
			questions,
			interests,
			image,
		} = user;
		res.send({
			userId,
			user_name,
			name,
			email,
			about,
			blogs,
			answers,
			questions,
			interests,
			image,
		});
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
});

router.get("/users", bodyParser, async (req, res) => {
	const user = await User.find({});
	var selectedUsers = [];
	var count = 0;

	user.sort((user1, user2) => {
		var val1 = -1,
			val2 = -1;
		for (var i = 0; i < user1.interests.length; i++) {
			if (user1.interests[i].interest == req.body.interest) {
				val1 = user1.interests[i].voteCount;
			}
		}
		for (var i = 0; i < user2.interests.length; i++) {
			if (user2.interests[i].interest == req.body.interest) {
				val2 = user2.interests[i].voteCount;
			}
		}
		if (val1 < val2) return 1;
		else if (val1 > val2) return -1;
		else return 0;
	});
	for (var i = 0; i < user.length; i++) {
		for (var j = 0; j < user[i].interests.length; j++) {
			if (user[i].interests[j].interest === req.body.interest) {
				selectedUsers.push(user[i]);
				count += 1;
				break;
			}
		}
		if (count >= 10) break;
	}
	res.send(selectedUsers);
});

router.delete("/users/me/image", auth, async (req, res) => {
	req.user.image = undefined;
	await req.user.save();
	res.send();
});

router.get("/users/:id/image", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.image) throw new Error();
		res.set("Content-Type", "images/png");
		res.send(user.image);
	} catch (e) {
		res.status(404).send();
	}
});

router.patch(
	"/users/me/update",
	auth,
	upload.single("image"),
	async (req, res) => {
		let image = req.file;
		const {
			name,
			email,
			description,
			password,
			graduation_year,
			field,
		} = req.body;
		if (name) {
			req.user.name = name;
		}
		if (email) {
			req.user.email = email;
		}
		if (password) {
			req.user.password = password;
		}
		if (description) {
			req.user.about.description = description;
		}
		if (field) {
			req.user.about.field = field;
		}
		if (graduation_year) {
			req.user.about.graduation_year = graduation_year;
		}
		try {
			if (image) {
				const buffer = await sharp(req.file.buffer)
					.resize({ width: 250, height: 250 })
					.png()
					.toBuffer();
				req.user.image = buffer;
				console.log("File", buffer);
			}
			await req.user.save();
			res.send({ message: "Success" });
		} catch (e) {
			res.status(500).send(e);
		}
	}
);

//Delete user account forever
router.delete("/users/me", auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		res.status(500).send();
	}
});

router.patch("/follow/space", auth, async (req, res) => {
	try {
		let user = req.user,
			data = req.body;
		const { type, spaceId } = data;
		if (type == "unfollow") {
			//remove interest from user
			if (user.interests) {
				user.interests = user.interests.filter((interest) => {
					return interest.interest !== spaceId;
				});
			}
		} else if (type == "follow") {
			//add interest in users array
			if (!user.interests) {
				user.interests = new Array();
			}
			user.interests = user.interests.concat({ interest: spaceId });
		}
		await user.save();
		res.send({ user });
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

module.exports = router;
