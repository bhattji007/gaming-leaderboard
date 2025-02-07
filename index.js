// server.js
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Import routes
const contestantRoutes = require('./routes/contestant.js');
const gameRoutes = require('./routes/games.js');
const leaderboardRoutes = require('./routes/leaderboard.js');

// Use routes
app.use('/contestants', contestantRoutes);
app.use('/games', gameRoutes);
app.use('/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/leaderboard_db';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
