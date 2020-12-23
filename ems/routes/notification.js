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
  try {
    const new_notification = new Notification(notification);
    await new_notification.save();

    users.forEach(async (id) => {
      const user = await User.findById(id);
      user.notifications.push(new_notification._id);
      await user.save();
    });

    res.status(200).send(new_notification);
  } catch (e) {
    res.status(400).json({ Error: "Server error" });
  }
});

// delete notification
router.delete("/notification/:id", async (req, res) => {
  const notify_id = req.params.id;
  try {
    const notification = await Notification.findById(notify_id);
    if (!notification) {
      return res.status(404).send("Notification not found !!");
    }
    const users = notification.users;
    users.forEach(async (user_id) => {
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).send("Can't delete it");
      }
      const index = user.notifications.indexOf(notify_id);
      user.notifications.splice(index, 1);
      await user.save();
    });

    await Notification.findByIdAndDelete(notify_id);
    res.status(200).send("Deleted successfully");
  } catch (e) {
    res.status(400).json({ Error: "Server Error" });
  }
});

// update notification
router.patch("/notification/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "body", "users"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  if (!isValid) {
    return res.status(400).send("Please provide only required fields");
  }
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNotification) {
      throw new Error();
    }
    res.status(200).send("Updated successfully :)");
  } catch (e) {
    res.status(400).json({ Error: "Server error" });
  }
});

module.exports = router;
