const mongoose = require('mongoose');

const LearningReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  enabled: { type: Boolean, default: false },
  reminderTime: { type: String, default: '09:00' },
  timezone: { type: String, default: 'UTC' },
  message: { type: String, default: 'Time for your daily learning session! Keep building your skills.' },
  lastSentAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('LearningReminder', LearningReminderSchema);
