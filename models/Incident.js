const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  mediaData: { type: String, default: null },
  mediaUrl: { type: String, default: null },
  contactNumber: { type: String, default: null },
  aiAnalysis: { type: Object, default: null },
  acceptedBy: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
