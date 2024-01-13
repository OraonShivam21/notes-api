const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const router = express.Router();

/**
 * @swagger
 * components:
 *    schemas:
 *        User:
 *            type: object
 *            properties:
 *                id:
 *                    type: string
 *                    description: The auto generated _id for each user
 *                username:
 *                    type: string
 *                    description: The username of the user
 *                email:
 *                    type: string
 *                    description: The email of the user
 *                password:
 *                    type: string
 *                    description: The hashed password of the user (hashed using bcrypt)
 */

/**
 * @swagger
 * /user/register:
 *  post:
 *    summary: To register a new user in the database
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: "your_username"
 *                required: true
 *              email:
 *                type: string
 *                example: "your_email"
 *                required: true
 *              password:
 *                type: string
 *                example: "your_password"
 *                required: true
 *    responses:
 *      201:
 *        description: Register a new user using username, email, password
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { message: "New user has been registerd" }
 *      400:
 *        description: The error message occuring if there is any problem
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { error: "Some kind of error message" }
 *      500:
 *        description: Some server error message
 */

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

/**
 * @swagger
 * /user/login:
 *  post:
 *    summary: To login the user in the application
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: "example@gmail.com"
 *                required: true
 *              password:
 *                type: string
 *                example: "example#password"
 *                required: true
 *    responses:
 *      200:
 *        description: Logs in the user if user had registered before
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { message: "Successfully logged in", accessToken: "access token" }
 *      400:
 *        description: The error message occuring if there is any problem
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { error: "Some kind of error message" }
 *      500:
 *        description: Some server error message
 */

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) throw "Please register yourself first!";
    bcrypt.compare(password, userFound.password, (err, result) => {
      if (err) throw err;
      if (!result) throw "Invalid credentials";
      const accessToken = jwt.sign(
        { userID: userFound._id, username: userFound.username },
        process.env.accessSecret
      );
      res.status(200).json({ message: "Successfully logged in", accessToken });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
