
const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Participation = require('../models/Participation');
const Contestant = require('../models/Contestant');


router.get('/global', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required in format YYYY-MM-DD' });
    }
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const games = await Game.find({
      startTime: { $gte: startDate, $lt: endDate },
    });
    const gameIds = games.map((game) => game._id);

    const leaderboard = await Participation.aggregate([
      { $match: { game: { $in: gameIds } } },
      {
        $group: {
          _id: '$contestant',
          totalScore: { $sum: '$score' },
        },
      },
      { $sort: { totalScore: -1 } },
      {
        $lookup: {
          from: 'contestants',
          localField: '_id',
          foreignField: '_id',
          as: 'contestant',
        },
      },
      { $unwind: '$contestant' },
      {
        $project: {
          _id: 0,
          contestantId: '$contestant._id',
          name: '$contestant.name',
          email: '$contestant.email',
          totalScore: 1,
        },
      },
    ]);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const participations = await Participation.find({ game: gameId })
      .populate('contestant')
      .sort({ score: -1 });

    const leaderboard = participations.map((p) => ({
      contestantId: p.contestant._id,
      name: p.contestant.name,
      email: p.contestant.email,
      score: p.score,
    }));

    res.json({
      game: {
        id: game._id,
        name: game.name,
        startTime: game.startTime,
        endTime: game.endTime,
        status: game.status,
      },
      leaderboard,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
