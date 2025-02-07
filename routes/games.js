
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Participation = require('../models/Participation');
const Contestant = require('../models/Contestant');


router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newGame = new Game({ name });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { name, status } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (status) {
      updateData.status = status;
      if (status === 'ended') updateData.endTime = new Date();
    }
    const game = await Game.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    await Participation.deleteMany({ game: req.params.id });
    res.json({ message: 'Game and related participations deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/:id/participants', async (req, res) => {
  try {
    const gameId = req.params.id;
    const { contestantId } = req.body;


    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status !== 'active')
      return res.status(400).json({ error: 'Cannot join a game that is not active' });

    const contestant = await Contestant.findById(contestantId);
    if (!contestant) return res.status(404).json({ error: 'Contestant not found' });


    const participation = new Participation({ game: gameId, contestant: contestantId });
    await participation.save();
    res.status(201).json(participation);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Contestant already joined the game' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});


router.delete('/:id/participants/:contestantId', async (req, res) => {
  try {
    const { id: gameId, contestantId } = req.params;
    const participation = await Participation.findOneAndDelete({ game: gameId, contestant: contestantId });
    if (!participation) return res.status(404).json({ error: 'Participation not found' });
    res.json({ message: 'Contestant removed from the game' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch('/:id/participants/:contestantId', async (req, res) => {
  try {
    const { id: gameId, contestantId } = req.params;
    const { score } = req.body;
    if (typeof score !== 'number') {
      return res.status(400).json({ error: 'Score must be a number' });
    }
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status !== 'active')
      return res.status(400).json({ error: 'Cannot update score for a game that is not active' });
    const participation = await Participation.findOne({ game: gameId, contestant: contestantId });
    if (!participation) return res.status(404).json({ error: 'Participation not found' });
    participation.score = score;
    participation.scoreUpdatedAt = new Date();
    await participation.save();
    res.json(participation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/upvote', async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    game.upvotes = (game.upvotes || 0) + 1;
    await game.save();
    res.json({ message: 'Game upvoted successfully', upvotes: game.upvotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
