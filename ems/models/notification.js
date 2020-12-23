const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  body: {
    type: String,
    required: true,
    trim: true,
  },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

const notificationModel = mongoose.model("Notifications", notificationSchema);

module.exports = notificationModel;
