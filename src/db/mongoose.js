const mongoose = require("mongoose");
console.log(process.env.MONGO_USER);
console.log(process.env.MONGO_PASSWORD);
mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.csecw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	}

);
