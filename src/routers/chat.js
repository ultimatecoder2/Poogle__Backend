const express = require("express");
const mongoose = require("mongoose");
const Chat = require("../models/chat");
const router = new express.Router();
const Pusher = require("pusher");
const auth = require("../middleware/auth");

const pusher = new Pusher({
  appId: "1149513",
  key: "563987a4f9fd4750ba5e",
  secret: "5004c97c4f50b5502978",
  cluster: "ap2",
  useTLS: true,
});

const db = mongoose.connection;

db.once("open", () => {
  const msgCollection = db.collection("chats");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", { msg: "New message added!" });
    } else {
      console.log("Pusher error");
    }
  });
});

// sending msgs
router.post("/messages", auth, async (req, res) => {
  const sender = req.user._id;
  const msg = req.body.msg;
  const reciever = req.body.to;
  console.log(sender, msg, reciever);
  try {
    const message = new Chat({
      sender,
      reciever,
      msg,
    });
    message.save();
    res.send(msg);
  } catch (e) {
    res.status(500).send(e);
  }
});

// receiving msgs
router.get("/messages", auth, async (req, res) => {
  const me = req.user._id;
  const chat = await Chat.find({
    $or: [{ sender: me }, { reciever: me }],
  })
    .sort({ createdAt: "asc" })
    .populate("sender")
    .populate("reciever")
    .exec();
  const idx = {};
  const formatedChat = [];
  for (var i = 0; i < chat.length; i++) {
    const sender = chat[i].sender._id.equals(me) ? "me" : "other";
    const when = new Date(chat[i].createdAt);
    const createdAt = when.toDateString();
    const msg = chat[i].msg;
    const to = chat[i].sender._id.equals(me)
      ? chat[i].reciever
      : chat[i].sender;
    if (to in idx) {
      const index = idx[to];
      formatedChat[index].chat.push({ sender, msg, createdAt });
    } else {
      idx[to] = formatedChat.length;
      formatedChat.push({
        _id: to._id,
        name: to.name,
        chat: [{ sender, msg, createdAt }],
      });
    }
  }
  res.status(200).send(formatedChat);
});

module.exports = router;
