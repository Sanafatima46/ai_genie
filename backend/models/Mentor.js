const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  company: String,
  expertise: [String],
  bio: String,
  yearsExperience: Number,
  avatar: String,
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Mentor', MentorSchema);
