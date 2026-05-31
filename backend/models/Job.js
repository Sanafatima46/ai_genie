const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  requirements: [String],
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship']
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
