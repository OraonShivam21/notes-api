const express = require("express");
const Note = require("../models/note.model");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(auth);

/**
 * @swagger
 * components:
 *    schemas:
 *        Note:
 *            type: object
 *            properties:
 *                id:
 *                    type: string
 *                    description: The auto generated _id for each note
 *                title:
 *                    type: string
 *                    description: The title of the note
 *                body:
 *                    type: string
 *                    description: The body of the note
 *                userID:
 *                    type: string
 *                    description: The user ID of the user who created the note
 *                username:
 *                    type: string
 *                    description: The username of the user who created the note
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 */

/**
 * @swagger
 * /note/create:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: To create a new note with title and body
 *    tags: [Note]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                required: true
 *                example: "title 1"
 *              body:
 *                type: string
 *                required: true
 *                example: "body 1"
 *    responses:
 *      201:
 *        description: Creates a new note
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { message: "New note has been created" }
 *      400:
 *        description: The error message occuring if there is any problem
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { error: "Some error message" }
 *      500:
 *        description: Some server error message
 */

router.post("/create", async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json({ message: "New note has been created" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

/**
 * @swagger
 * /note:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: To get all the notes created by logged in user
 *    tags: [Note]
 *    responses:
 *      200:
 *        description: Gets notes created by user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { notes: [ "all the notes created by user" ] }
 *      400:
 *        description: The error message occuring if there is any problem
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { error: "Some error message" }
 *      404:
 *        description: If user hasn't created any notes yet
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { message: "Please create new notes first." }
 *      500:
 *        description: Some server error message
 */

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ userID: req.body.userID });
    if (notes.length > 0) {
      res.status(200).json({ notes });
    } else {
      res.status(404).json({ message: "Please create new notes first." });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

/**
 * @swagger
 * /note/update/{id}:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    summary: To update the note created by user
 *    tags: [Note]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the note to be updated
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                required: true
 *                example: "title 1"
 *              body:
 *                type: string
 *                required: true
 *                example: "body 1"
 *    responses:
 *      201:
 *        description: Gets notes created by user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { message: "Note has been updated" }
 *      400:
 *        description: The error message occuring if there is any problem
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { error: "Some error message" }
 *      500:
 *        description: Some server error message
 */

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

/**
 * @swagger
 * /note/delete/{id}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: To delete the note created by user
 *    tags: [Note]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The id of the note to be updated
 *    responses:
 *      201:
 *        description: Gets notes created by user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { message: "Note has been deleted" }
 *      400:
 *        description: The error message occuring if there is any problem
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              example: { error: "Some error message" }
 *      500:
 *        description: Some server error message
 */

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
