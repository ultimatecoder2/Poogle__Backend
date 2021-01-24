const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/mongoose");

const User = require("./models/user");
const userRouter = require("./routers/user");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(userRouter);

app.listen(port, () => {
	console.log("Server is up on port", port);
});
