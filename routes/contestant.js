
const express = require('express');
const router = express.Router();
const Contestant = require('../models/Contestant');


router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(name,email)
    const newContestant = new Contestant({ name, email });
    await newContestant.save();
    res.status(201).json(newContestant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const contestants = await Contestant.find();
    res.json(contestants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const contestant = await Contestant.findById(req.params.id);
    if (!contestant) return res.status(404).json({ error: 'Contestant not found' });
    res.json(contestant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const contestant = await Contestant.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    if (!contestant) return res.status(404).json({ error: 'Contestant not found' });
    res.json(contestant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const contestant = await Contestant.findByIdAndDelete(req.params.id);
    if (!contestant) return res.status(404).json({ error: 'Contestant not found' });
    res.json({ message: 'Contestant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
