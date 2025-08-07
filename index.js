const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

let habits = require('./habits.json');

app.get('/habits', (req, res) => res.json(habits));
app.post('/habits', (req, res) => {
  const habit = { id: Date.now().toString(), name: req.body.name, createdAt: new Date().toISOString(), history: [] };
  habits.push(habit);
  fs.writeFileSync('./habits.json', JSON.stringify(habits, null, 2));
  res.status(201).json(habit);
});
app.patch('/habits/:id/check', (req, res) => {
  const habit = habits.find(h => h.id === req.params.id);
  if (!habit) return res.status(404).send('Hábito no encontrado');
  const today = new Date().toISOString().split('T')[0];
  if (!habit.history.includes(today)) habit.history.push(today);
  fs.writeFileSync('./habits.json', JSON.stringify(habits, null, 2));
  res.json(habit);
});
app.get('/habits/:id/stats', (req, res) => {
  const habit = habits.find(h => h.id === req.params.id);
  if (!habit) return res.status(404).send('Hábito no encontrado');
  res.json({ totalDays: habit.history.length });
});
app.delete('/habits/:id', (req, res) => {
  habits = habits.filter(h => h.id !== req.params.id);
  fs.writeFileSync('./habits.json', JSON.stringify(habits, null, 2));
  res.status(204).send();
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API corriendo en puerto ${port}`));
