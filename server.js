const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(express.json());

// Rota para listar todas as notas (GET)
app.get('/notes', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    res.json(data.notes);
});

// Rota para criar uma nota (POST)
app.post('/notes', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const newNote = { id: Date.now(), ...req.body };
    data.notes.push(newNote);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.json(newNote);
});

// Rota para atualizar uma nota (PUT)
app.put('/notes/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const noteIndex = data.notes.findIndex(note => note.id == req.params.id);
    if (noteIndex >= 0) {
        data.notes[noteIndex] = { ...data.notes[noteIndex], ...req.body };
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        res.json(data.notes[noteIndex]);
    } else {
        res.status(404).json({ error: "Nota não encontrada" });
    }
});

// Rota para deletar uma nota (DELETE)
app.delete('/notes/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    data.notes = data.notes.filter(note => note.id != req.params.id);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));