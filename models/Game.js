// models/Game.js
const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', GameSchema);
