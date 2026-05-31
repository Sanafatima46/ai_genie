const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'My Resume'
  },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    summary: String
  },
  skills: [String],
  experience: [{
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    year: String
  }],
  rawText: String,
  // Stores the Builder's flat form data so it can be round-tripped
  builderData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
