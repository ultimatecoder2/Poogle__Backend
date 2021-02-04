const express = require("express");
const cors = require("cors");
const logger = require("morgan");
var path = require("path");
const multer = require("multer");

require("dotenv").config();
require("./db/mongoose");

const userRouter = require("./routers/user");
const chatRouter = require("./routers/chat");
const spaceRouter = require("./routers/spaces");
const questionRouter = require("./routers/question");
const questionCommentRouter = require("./routers/questionComments");
const blogRouter = require("./routers/blogs");
const blogCommentRouter = require("./routers/blogComments");
const answerRouter = require("./routers/answer");
const uploadRouter = require("./routers/upload");

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({
	dest: "images",
});

// app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(express.static(path.join(__dirname, '../public')));
app.use("/uploads", express.static("uploads"));

app.use(userRouter);
app.use(spaceRouter);
app.use(questionRouter);
app.use(questionCommentRouter);
app.use(blogRouter);
app.use(blogCommentRouter);
app.use(answerRouter);
app.use(uploadRouter);
app.use(chatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(new Error(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	if (err) {
		console.log(err);
		console.log("Hi fams");
	}
	// render the error page
	res.status(err.status || 500);
	res.json({ error: err });
});

app.listen(port, () => {
	console.log("Server is up on port", port);
});
