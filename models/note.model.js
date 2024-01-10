const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Note = mongoose.model("note", noteSchema);

module.exports = Note;
