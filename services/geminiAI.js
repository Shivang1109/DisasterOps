const Groq = require('groq-sdk');

// Lazy-load Groq client to ensure env vars are loaded
let groq = null;

const getGroqClient = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️ GROQ_API_KEY not found in environment');
      return null;
    }
    try {
      groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });
      console.log('✅ Groq client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Groq client:', error.message);
      return null;
    }
  }
  return groq;
};

const triageIncident = async (incident) => {
  try {
    const groqClient = getGroqClient();
    if (!groqClient) {
      console.log('⚠️ Groq client unavailable, skipping AI triage');
      return null;
    }

    const prompt = `You are an emergency response AI assistant for DisasterOps, an Indian disaster management platform.

Analyze this emergency incident and provide a structured triage assessment:

Incident Type: ${incident.type}
Description: ${incident.description}
Reported Severity: ${incident.severity}
Location: Lat ${incident.location.lat}, Lng ${incident.location.lng}
Time: ${new Date().toISOString()}

Respond with ONLY a valid JSON object in this exact format, no markdown, no extra text:
{
  "aiSeverity": "low|medium|high|critical",
  "confidenceScore": 0.0-1.0,
  "summary": "2 sentence plain English summary of the situation",
  "immediateActions": ["action1", "action2", "action3"],
  "estimatedResponseTime": "X minutes",
  "resourcesNeeded": ["resource1", "resource2"],
  "riskFactors": ["factor1", "factor2"],
  "hindiSummary": "2 sentence summary in Hindi for field responders"
}`;

    const message = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const text = message.choices[0].message.content.trim();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(cleaned);

    console.log(`🤖 Groq Triage: ${incident.type} → AI Severity: ${analysis.aiSeverity} (confidence: ${analysis.confidenceScore})`);
    return analysis;
  } catch (error) {
    console.error('❌ Groq AI triage error:', error.message);
    return null;
  }
};

const generateVictimGuidance = async (incidentType, userMessage) => {
  try {
    const groqClient = getGroqClient();
    if (!groqClient) {
      return {
        message: 'Help is on the way. Please stay calm and remain in a safe location.',
        hindiMessage: 'मदद आ रही है। कृपया शांत रहें और सुरक्षित स्थान पर रहें।'
      };
    }

    const prompt = `You are a calm, reassuring emergency response assistant for DisasterOps India.
A victim is experiencing a ${incidentType} emergency and has sent this message: "${userMessage}"

Provide brief, actionable guidance to keep them safe until help arrives.
Respond with ONLY a valid JSON object, no markdown:
{
  "message": "2-3 sentence calming and actionable guidance in English",
  "hindiMessage": "Same guidance in Hindi",
  "doList": ["do this", "do this"],
  "dontList": ["don't do this"]
}`;

    const message = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const text = message.choices[0].message.content.trim();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Groq guidance error:', error.message);
    return {
      message: 'Help is on the way. Stay calm, move to safety if possible.',
      hindiMessage: 'मदद आ रही है। शांत रहें, अगर संभव हो तो सुरक्षित स्थान पर जाएं।'
    };
  }
};

module.exports = { triageIncident, generateVictimGuidance };
