const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
}, { _id: false });

const SkillAssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  questions: [QuestionSchema],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  recommendations: [String],
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('SkillAssessment', SkillAssessmentSchema);
