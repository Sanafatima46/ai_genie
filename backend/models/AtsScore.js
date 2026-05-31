const mongoose = require('mongoose');

const AtsScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  tips: [String],
  strengths: [String],
  weaknesses: [String],
  source: { type: String, enum: ['upload', 'resume'], default: 'resume' },
}, { timestamps: true });

module.exports = mongoose.model('AtsScore', AtsScoreSchema);
