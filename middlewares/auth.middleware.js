const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.accessSecret);
      if (!decoded) throw "Unauthorized - You're not authorized";
      req.body.userID = decoded.userID;
      req.body.username = decoded.username;
      next();
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(400).json({ message: "Please login first!" });
  }
};

module.exports = auth;
