const mongoose = require('mongoose');

const WeekPlanSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  topics: [String],
  tasks: [String],
  resources: [String],
}, { _id: false });

const LearningRoadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  durationMonths: { type: Number, default: 3 },
  weeks: [WeekPlanSchema],
  summary: String,
}, { timestamps: true });

module.exports = mongoose.model('LearningRoadmap', LearningRoadmapSchema);
