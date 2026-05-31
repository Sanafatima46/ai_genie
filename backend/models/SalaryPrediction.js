const mongoose = require('mongoose');

const SalaryPredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [String],
  experienceYears: Number,
  location: String,
  role: String,
  minSalary: Number,
  maxSalary: Number,
  currency: { type: String, default: 'USD' },
  explanation: String,
}, { timestamps: true });

module.exports = mongoose.model('SalaryPrediction', SalaryPredictionSchema);
