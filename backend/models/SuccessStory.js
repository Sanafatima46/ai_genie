const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  title: { type: String, required: true },
  story: { type: String, required: true },
  role: String,
  company: String,
  approved: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);
