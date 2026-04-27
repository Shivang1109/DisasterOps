// Quick test script to verify Gemini AI integration
const axios = require('axios');

const testIncident = {
  type: 'fire',
  description: 'Building fire on 3rd floor, people trapped, smoke everywhere',
  severity: 'high',
  location: {
    lat: 26.8467,
    lng: 80.9462
  },
  contactNumber: '9876543210'
};

console.log('🧪 Testing Gemini AI Triage Integration...\n');
console.log('📝 Submitting test incident:', testIncident.description);

axios.post('http://localhost:5005/api/incidents', testIncident)
  .then(response => {
    console.log('\n✅ Incident created successfully!');
    console.log('📋 Incident ID:', response.data._id);
    
    console.log('\n⏳ Waiting 8 seconds for Gemini AI analysis...');
    
    setTimeout(() => {
      axios.get(`http://localhost:5005/api/incidents/${response.data._id}`)
        .then(res => {
          console.log('\n🤖 GEMINI AI TRIAGE RESULTS:');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          
          if (res.data.aiAnalysis) {
            console.log('✅ AI Analysis Found!');
            console.log('\n📊 AI Severity:', res.data.aiAnalysis.aiSeverity?.toUpperCase());
            console.log('🎯 Confidence:', Math.round((res.data.aiAnalysis.confidenceScore || 0) * 100) + '%');
            console.log('📝 Summary:', res.data.aiAnalysis.summary);
            console.log('🇮🇳 Hindi:', res.data.aiAnalysis.hindiSummary);
            
            if (res.data.aiAnalysis.immediateActions) {
              console.log('\n⚡ Immediate Actions:');
              res.data.aiAnalysis.immediateActions.forEach((action, i) => {
                console.log(`   ${i + 1}. ${action}`);
              });
            }
            
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🎉 SUCCESS! Gemini AI is working perfectly!');
          } else {
            console.log('❌ No AI analysis found. Check backend logs for errors.');
            console.log('💡 Make sure GEMINI_API_KEY is set in .env file');
          }
        })
        .catch(err => {
          console.error('❌ Error fetching incident:', err.message);
        });
    }, 8000);
  })
  .catch(error => {
    console.error('❌ Error creating incident:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  });
