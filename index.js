const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

app.get('/notes', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  res.json(data.notes);
});

app.post('/notes', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  const newNote = { id: Date.now(), ...req.body };
  data.notes.push(newNote);
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.status(201).json(newNote);
});

app.put('/notes/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  const noteIndex = data.notes.findIndex(note => note.id == req.params.id);
  if (noteIndex === -1) return res.status(404).send('Nota não encontrada.');
  data.notes[noteIndex] = { ...data.notes[noteIndex], ...req.body };
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.json(data.notes[noteIndex]);
});

app.delete('/notes/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  data.notes = data.notes.filter(note => note.id != req.params.id);
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));