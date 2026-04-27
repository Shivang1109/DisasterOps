const { GoogleGenerativeAI } = require('@google/generative-ai');

// Lazy-load Gemini client to ensure env vars are loaded
let genAI = null;
let model = null;

const getGeminiClient = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment');
      return null;
    }
    try {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('✅ Google Gemini AI initialized (gemini-1.5-flash)');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini client:', error.message);
      return null;
    }
  }
  return model;
};

const triageIncident = async (incident) => {
  try {
    const geminiModel = getGeminiClient();
    if (!geminiModel) {
      console.log('⚠️ Gemini client unavailable, skipping AI triage');
      return null;
    }

    const prompt = `You are an emergency response AI assistant for DisasterOps, an Indian disaster management platform powered by Google Gemini AI.

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

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Clean markdown formatting if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(cleaned);

    console.log(`🤖 Google Gemini Triage: ${incident.type} → AI Severity: ${analysis.aiSeverity} (confidence: ${analysis.confidenceScore})`);
    return analysis;
  } catch (error) {
    console.error('❌ Gemini AI triage error:', error.message);
    return null;
  }
};

const generateVictimGuidance = async (incidentType, userMessage) => {
  try {
    const geminiModel = getGeminiClient();
    if (!geminiModel) {
      return {
        message: 'Help is on the way. Please stay calm and remain in a safe location.',
        hindiMessage: 'मदद आ रही है। कृपया शांत रहें और सुरक्षित स्थान पर रहें।'
      };
    }

    const prompt = `You are a calm, reassuring emergency response assistant for DisasterOps India, powered by Google Gemini AI.
A victim is experiencing a ${incidentType} emergency and has sent this message: "${userMessage}"

Provide brief, actionable guidance to keep them safe until help arrives.
Respond with ONLY a valid JSON object, no markdown:
{
  "message": "2-3 sentence calming and actionable guidance in English",
  "hindiMessage": "Same guidance in Hindi",
  "doList": ["do this", "do this"],
  "dontList": ["don't do this"]
}`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('❌ Gemini guidance error:', error.message);
    return {
      message: 'Help is on the way. Stay calm, move to safety if possible.',
      hindiMessage: 'मदद आ रही है। शांत रहें, अगर संभव हो तो सुरक्षित स्थान पर जाएं।'
    };
  }
};

module.exports = { triageIncident, generateVictimGuidance };
