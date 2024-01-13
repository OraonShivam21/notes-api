const express = require("express");
const cors = require("cors")
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const connection = require("./connection");
const userRoute = require("./routes/user.route");
const noteRoute = require("./routes/note.route");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes Management System with User registration, login, and authentication",
      version: "1.0.0",
    },
    servers: [
      { 
        url: "http://localhost:3000", 
        description: "Localhost link with port:3000" 
      },
      {
        url: "https://notes-taking-web-app.onrender.com",
        description: "Deployed link on render.com"
      }
    ],
  },
  apis: ["./routes/*.js"],
};

const openAPISpec = swaggerJSDoc(options);

app.use("/apidocs", swaggerUI.serve, swaggerUI.setup(openAPISpec));

app.use("/user", userRoute);
app.use("/note", noteRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the backend api" });
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
