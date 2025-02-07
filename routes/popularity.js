const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Participation = require('../models/Participation');

function getYesterdayRange() {
  const now = new Date();
  const yesterdayStart = new Date(now);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  yesterdayStart.setHours(0, 0, 0, 0);
  
  const yesterdayEnd = new Date(now);
  yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
  yesterdayEnd.setHours(23, 59, 59, 999);
  
  return { yesterdayStart, yesterdayEnd };
}

async function getGameStats(game, timeRange) {
  const yesterdaySessions = await Participation.find({
    game: game._id,
    exitedAt: { $gte: timeRange.yesterdayStart, $lte: timeRange.yesterdayEnd }
  });

  const uniquePlayers = new Set(yesterdaySessions.map(p => p.contestant.toString()));
  const longestSession = yesterdaySessions.reduce((longest, session) => {
    if (session.joinedAt && session.exitedAt) {
      const duration = (session.exitedAt - session.joinedAt) / 1000;
      return Math.max(longest, duration);
    }
    return longest;
  }, 0);

  const currentlyPlaying = await Participation.find({
    game: game._id,
    exitedAt: { $exists: false }
  });

  return {
    gameId: game._id,
    name: game.name,
    uniquePlayersYesterday: uniquePlayers.size,
    currentPlayers: currentlyPlaying.length,
    upvotes: game.upvotes || 0,
    longestSessionTime: longestSession,
    totalSessionsYesterday: yesterdaySessions.length
  };
}

function calculateGameScore(stats, highestStats) {
  const metrics = {
    uniquePlayersYesterday: 0.3,
    currentPlayers: 0.2,
    upvotes: 0.25,
    longestSessionTime: 0.15,
    totalSessionsYesterday: 0.1
  };

  return Object.entries(metrics).reduce((total, [stat, weight]) => {
    const normalizedValue = stats[stat] / highestStats[stat];
    return total + (weight * normalizedValue);
  }, 0);
}

router.get('/', async (req, res) => {
  try {
    const timeRange = getYesterdayRange();
    const allGames = await Game.find();
    
    const gameStats = await Promise.all(
      allGames.map(game => getGameStats(game, timeRange))
    );

    const highestStats = {
      uniquePlayersYesterday: Math.max(...gameStats.map(g => g.uniquePlayersYesterday), 1),
      currentPlayers: Math.max(...gameStats.map(g => g.currentPlayers), 1),
      upvotes: Math.max(...gameStats.map(g => g.upvotes), 1),
      longestSessionTime: Math.max(...gameStats.map(g => g.longestSessionTime), 1),
      totalSessionsYesterday: Math.max(...gameStats.map(g => g.totalSessionsYesterday), 1)
    };

    const rankedGames = gameStats.map(stats => ({
      ...stats,
      popularityScore: calculateGameScore(stats, highestStats)
    }));

    rankedGames.sort((a, b) => b.popularityScore - a.popularityScore);
    res.json(rankedGames);
    
  } catch (err) {
    console.error('Failed to rank games:', err);
    res.status(500).json({ error: 'Unable to calculate game rankings' });
  }
});

module.exports = router;
