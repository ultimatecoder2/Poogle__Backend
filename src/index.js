const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");

const userRouter = require("./routers/user");
const chatRouter = require("./routers/chat");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(chatRouter);

app.listen(port, () => {
	console.log("Server is up on port", port);
});
