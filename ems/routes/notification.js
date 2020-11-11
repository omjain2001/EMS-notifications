const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Notification = require("../models/notification");

// auth middleware
const auth = (req, res, next) => {
  const id = req.header("user_id");
  if (id) {
    req.user = { id };
  }
  next();
};

// get all notifications
router.get("/notifications", auth, async (req, res) => {
  const user_id = req.user.id;

  try {
    const user = await User.findById(user_id);
    if (!user) {
      throw new Exception("User not found !!");
    }

    await user.populate("notifications", ["title", "body"]).execPopulate();

    res.status(200).send(user);
  } catch (e) {
    console.log({ "Error : ": e.message });
  }
});

// add notification
router.post("/notification/add", auth, async (req, res) => {
  const { title, body, users } = req.body;
  const notification = {
    title,
    body,
    users,
  };
  const new_notification = new Notification(notification);
  await new_notification.save();

  res.status(200).send(new_notification);
});

module.exports = router;
