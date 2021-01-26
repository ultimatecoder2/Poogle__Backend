const express = require("express");
const cors = require("cors");
const logger = require('morgan');

require("dotenv").config();
require("./db/mongoose");

const userRouter = require("./routers/user");
const chatRouter = require("./routers/chat");
const spaceRouter = require("./routers/spaces");
const questionRouter = require('./routers/question');
const questionCommentRouter = require('./routers/questionComments');
const blogRouter = require('./routers/blogs');
const blogCommentRouter = require('./routers/blogComments');

const app = express();
const port = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(userRouter);
app.use(spaceRouter);
app.use(questionRouter);
app.use(questionCommentRouter);
app.use(blogRouter);
app.use(blogCommentRouter);
app.use(chatRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
	});

	// error handler
	app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
	});


app.listen(port, () => {
	console.log("Server is up on port", port);
});
