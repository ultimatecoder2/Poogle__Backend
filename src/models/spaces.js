const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique:true, 
		trim:true
	},
	stringId:{
		type:String, 
		//required:true,
		unique:true,
		trim:true
	},
	image:{
		type:Buffer
	},
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId, //giving reference to the user ID
			ref: "User",
		},

	],
	questions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question",
		},
	],
});

spaceSchema.methods.toJSON = function(){
	const space = this;
	const spaceObject = space.toObject()
	delete spaceObject.image
	return spaceObject;
}

const Spaces = mongoose.model("Space", spaceSchema);
module.exports = Spaces;
