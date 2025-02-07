
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParticipationSchema = new Schema(
  {
    game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    contestant: { type: Schema.Types.ObjectId, ref: 'Contestant', required: true },
    score: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    exitedAt: { type: Date },
    scoreUpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


ParticipationSchema.index({ game: 1, contestant: 1 }, { unique: true });

module.exports = mongoose.model('Participation', ParticipationSchema);
