// Detailed API key test
require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Testing Gemini API Key...\n');
console.log('API Key format:', API_KEY ? `${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}` : 'NOT FOUND');
console.log('API Key length:', API_KEY ? API_KEY.length : 0);
console.log('\n📡 Making test request to Gemini API...\n');

const data = JSON.stringify({
  contents: [{
    parts: [{
      text: "Say hello"
    }]
  }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  console.log('Status Code:', res.statusCode);
  console.log('Status Message:', res.statusMessage);
  console.log('\nResponse Headers:', JSON.stringify(res.headers, null, 2));
  console.log('\n---\n');
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseData);
      
      if (res.statusCode === 200) {
        console.log('✅ SUCCESS! API key is working!\n');
        console.log('Response:', JSON.stringify(parsed, null, 2));
      } else {
        console.log('❌ ERROR Response:\n');
        console.log(JSON.stringify(parsed, null, 2));
        
        if (parsed.error) {
          console.log('\n🔍 Error Details:');
          console.log('Message:', parsed.error.message);
          console.log('Status:', parsed.error.status);
          
          if (parsed.error.message.includes('API key not valid')) {
            console.log('\n💡 SOLUTION: Your API key is invalid or expired.');
            console.log('   1. Go to: https://aistudio.google.com/app/apikey');
            console.log('   2. Delete the old key');
            console.log('   3. Create a NEW API key');
            console.log('   4. Update .env file');
          } else if (parsed.error.message.includes('not found')) {
            console.log('\n💡 SOLUTION: The model is not available.');
            console.log('   1. Go to: https://console.cloud.google.com/apis/library');
            console.log('   2. Search "Generative Language API"');
            console.log('   3. Click ENABLE');
            console.log('   4. Wait 2-3 minutes');
          } else if (parsed.error.message.includes('billing')) {
            console.log('\n💡 SOLUTION: Billing not enabled.');
            console.log('   1. Go to: https://console.cloud.google.com/billing');
            console.log('   2. Link a billing account (free tier available)');
          }
        }
      }
    } catch (e) {
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.write(data);
req.end();
