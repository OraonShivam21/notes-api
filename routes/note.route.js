const express = require("express");
const Note = require("../models/note.model");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(auth);

router.post("/create", async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json({ message: "New note has been created" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ userID: req.body.userID });
    if (notes.length > 0) {
      res.status(200).json({ notes });
    } else {
      res.status(200).json({ message: "Please create new notes first." });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.patch("/update/:id", async (req, res) => {
  const noteID = req.params.id;
  const payload = req.body;
  try {
    const noteFound = await Note.findOne({ _id: noteID });
    if (noteFound.userID !== req.body.userID)
      throw "Unauthorized - You're not authorized to update this note";
    await Note.findByIdAndUpdate(noteID, payload);
    res.status(201).json({ message: "Note has been updated" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const noteID = req.params.id;
  try {
    const noteFound = await Note.findOne({ _id: noteID });
    if (noteFound.userID !== req.body.userID)
      throw "Unauthorized - You're not authorized to delete this note";
    await Note.findByIdAndDelete(noteID);
    res.status(201).json({ message: "Note has been deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
