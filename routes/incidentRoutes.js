const express = require('express');
const router = express.Router();
const { createIncident, getIncidents, updateIncidentStatus, getIncidentDetail } = require('../controllers/incidentController');
const { generateVictimGuidance } = require('../services/geminiAI');

router.route('/').post(createIncident).get(getIncidents);
router.route('/:id').get(getIncidentDetail);
router.route('/:id/status').put(updateIncidentStatus);
router.post('/ai-guidance', async (req, res) => {
  try {
    const { incidentType, message } = req.body;
    const guidance = await generateVictimGuidance(incidentType || 'emergency', message || 'I need help');
    res.status(200).json(guidance);
  } catch (error) {
    res.status(500).json({ message: 'AI guidance error' });
  }
});

module.exports = router;
