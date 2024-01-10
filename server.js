const express = require("express");
const connection = require("./connection");
const userRoute = require("./routes/user.route");
const noteRoute = require("./routes/note.route");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/user", userRoute);
app.use("/note", noteRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the notes taking api" });
});

app.listen(port, async () => {
  try {
    await connection;
    console.log("connected to db");
    console.log("listening on port", port);
  } catch (error) {
    console.error(error);
  }
});
