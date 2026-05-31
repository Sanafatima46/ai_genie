const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  credentialId: String,
  issueDate: { type: Date, required: true },
  expiryDate: Date,
  reminderDays: { type: Number, default: 30 },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Certification', CertificationSchema);
