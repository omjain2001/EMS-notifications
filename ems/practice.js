const mongoose = require("mongoose");
const express = require("express");
const User = require("./models/User");
const notificationRoute = require("./routes/notification");

const app = express();
app.use(express.json());
app.use("/", notificationRoute);

// Database setup
const MONGODB_URL =
  "mongodb+srv://Omjain_2001:Omjain_2001@task-manager.ibhbz.mongodb.net/practice?retryWrites=true&w=majority";

try {
  mongoose.connect(
    MONGODB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log("Database connected successfully");
    }
  );
} catch (e) {
  console.log("Error in correction");
}

// get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// get single user
app.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json(user);
});

// add user
app.post("/user", async (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    name,
    email,
  };

  const user = new User(newUser);
  await user.save();

  res.status(200).send(user);
});

// update user
app.patch("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.send(updatedUser);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

app.listen(3000, () => {
  console.log("Server connected to port 3000");
});
