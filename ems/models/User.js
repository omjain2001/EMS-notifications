const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notifications",
    },
  ],
});

const User = mongoose.model("user", userSchema);

module.exports = User;
