import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = "db.json";

app.use(cors());
app.use(express.json());

function readNotes() {
  const data = fs.existsSync(DB_FILE) ? fs.readFileSync(DB_FILE) : "[]";
  return JSON.parse(data);
}

function writeNotes(notes) {
  fs.writeFileSync(DB_FILE, JSON.stringify(notes, null, 2));
}

app.get("/notes", (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

app.post("/notes", (req, res) => {
  const notes = readNotes();
  const newNote = { id: Date.now(), ...req.body };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});

app.put("/notes/:id", (req, res) => {
  let notes = readNotes();
  const id = parseInt(req.params.id);
  notes = notes.map(n => (n.id === id ? { ...n, ...req.body } : n));
  writeNotes(notes);
  res.json({ message: "Nota atualizada" });
});

app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let notes = readNotes();
  notes = notes.filter(n => n.id !== id);
  writeNotes(notes);
  res.json({ message: "Nota deletada" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
  