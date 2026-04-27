// List available models
require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Fetching list of available models...\n');

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models?key=${API_KEY}`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseData);
      
      if (res.statusCode === 200 && parsed.models) {
        console.log(`✅ Found ${parsed.models.length} available models:\n`);
        
        parsed.models.forEach((model, i) => {
          console.log(`${i + 1}. ${model.name}`);
          console.log(`   Display Name: ${model.displayName}`);
          console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
          console.log('');
        });
        
        // Find models that support generateContent
        const contentModels = parsed.models.filter(m => 
          m.supportedGenerationMethods?.includes('generateContent')
        );
        
        if (contentModels.length > 0) {
          console.log('\n✅ Models that support generateContent:');
          contentModels.forEach(m => {
            console.log(`   - ${m.name.replace('models/', '')}`);
          });
        }
      } else {
        console.log('❌ ERROR:\n');
        console.log(JSON.stringify(parsed, null, 2));
        
        if (parsed.error?.message?.includes('API key not valid')) {
          console.log('\n💡 Your API key is invalid. Create a new one at:');
          console.log('   https://aistudio.google.com/app/apikey');
        } else if (parsed.error?.code === 403) {
          console.log('\n💡 Generative Language API is NOT enabled!');
          console.log('   Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
          console.log('   Click ENABLE button');
        }
      }
    } catch (e) {
      console.log('Raw response:', responseData);
      console.log('Parse error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.end();
