const express = require("express");
const path = require("path");
const fs = require("fs");
var savedNotes = require("./db/db.json");
const uniqueID = require("uniqid");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/notes", (req, res) => {
  res.json(savedNotes);
});
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uniqueID();
  savedNotes.push(newNote);
  res.json(savedNotes);
  fs.writeFile("./db/db.json", JSON.stringify(savedNotes), (err) => {
    if (err) throw err;
    console.log("file written");
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteID = req.params.id;
  const newNotes = [];
  for (i = 0; i < savedNotes.length; i++) {
    let note = savedNotes[i];
    if (note.id !== noteID) {
      newNotes.push(note);
    }
  }
  savedNotes = newNotes;
  fs.writeFile("./db/db.json", JSON.stringify(savedNotes), (err) => {
    if (err) throw err;
    console.log("file written");
    res.json(savedNotes);
  });
});

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
