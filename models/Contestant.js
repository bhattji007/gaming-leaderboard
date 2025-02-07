
const mongoose = require('mongoose');

const ContestantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contestant', ContestantSchema);
