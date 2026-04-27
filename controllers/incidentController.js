const Incident = require('../models/Incident');
const { triageIncident } = require('../services/geminiAI');

const createIncident = async (req, res) => {
  try {
    const { type, description, location, severity, mediaData, mediaUrl, contactNumber } = req.body;

    if (!type || !description || !location || location.lat === undefined || location.lng === undefined || !severity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const incident = await Incident.create({
      type,
      description,
      location: { lat: parseFloat(location.lat), lng: parseFloat(location.lng) },
      severity,
      mediaData: mediaData || null,
      mediaUrl: mediaUrl || null,
      contactNumber: contactNumber || null
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('new_incident', incident);
      notifyNearbyProviders(io, incident);
    }

    // Run Gemini AI triage in background (non-blocking)
    triageIncident(incident).then(async (analysis) => {
      if (analysis) {
        await Incident.findByIdAndUpdate(incident._id, { aiAnalysis: analysis });
        const io = req.app.get('io');
        if (io) io.emit('incident_updated', { ...incident.toObject(), aiAnalysis: analysis });
        console.log(`✅ AI triage complete for incident ${incident._id}`);
      }
    }).catch(err => console.error('AI triage background error:', err));

    res.status(201).json(incident);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getIncidents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.severity) filter.severity = req.query.severity;

    const incidents = await Incident.find(filter).sort({ createdAt: -1 }).limit(100);
    res.status(200).json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateIncidentStatus = async (req, res) => {
  try {
    const { status, acceptedBy } = req.body;
    const { id } = req.params;

    const validStatuses = ['pending', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const incident = await Incident.findByIdAndUpdate(
      id,
      { status, acceptedBy: acceptedBy || null },
      { new: true }
    );

    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    const io = req.app.get('io');
    if (io) io.emit('incident_updated', incident);

    res.status(200).json(incident);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getIncidentDetail = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    res.status(200).json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const notifyNearbyProviders = (io, incident) => {
  const routingMap = {
    'fire': 'fire_engine',
    'flood': 'ndrf',
    'earthquake': 'sdrf',
    'medical': 'gov_ambulance',
    'accident': 'gov_ambulance',
    'gas_leak': 'hazmat_team',
    'trapped': 'rescue_squad',
    'missing_person': 'cid',
    'crime': 'police',
    'cyber_threat': 'cyber_cell'
  };

  const room = routingMap[incident.type] || 'police';
  io.to('admin').emit('red_alert', incident);
  io.to(room).emit('red_alert', incident);
  console.log(`🚨 Red Alert: ${incident.type} → ${room}`);
};

module.exports = { createIncident, getIncidents, updateIncidentStatus, getIncidentDetail };
