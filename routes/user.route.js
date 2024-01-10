const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) throw err;
      const user = new User({ username, email, password: hash });
      await user.save();
      res.status(201).json({ message: "New user has been registered" });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) throw new Erro("Please register yourself first!");
    bcrypt.compare(password, userFound.password, (err, result) => {
      if (err) throw err;
      if (result) {
        const accessToken = jwt.sign(
          { userID: userFound._id, username: userFound.username },
          process.env.accessSecret
        );
        res
          .status(200)
          .json({ message: "Successfully logged in", accessToken });
      } else {
        res.status(200).json({ message: "Invalid credentials" });
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
