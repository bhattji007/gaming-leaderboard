
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const contestantRoutes = require('./routes/contestant');
const gameRoutes = require('./routes/games');
const leaderboardRoutes = require('./routes/leaderboard');
const popularityRoutes = require('./routes/popularity');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use('/contestants', contestantRoutes);
app.use('/health', async (req, res) => {
  res.send('Hello World');
});

app.use('/games', gameRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/popularity', popularityRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not set in the environment variables.');
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
