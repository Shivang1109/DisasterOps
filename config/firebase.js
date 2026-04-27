const admin = require('firebase-admin');
require('dotenv').config();

let serviceAccount = null;
let firebaseInitialized = false;

// Try to initialize Firebase Admin SDK
try {
  const keyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (keyString && keyString.includes('private_key') && !keyString.includes('YOUR_')) {
    try {
      serviceAccount = JSON.parse(keyString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      firebaseInitialized = true;
      console.log('✅ Firebase Admin SDK initialized with credentials');
    } catch (parseError) {
      console.warn('⚠️ Firebase credentials format error:', parseError.message);
      console.warn('⚠️ Running in development mode without Firestore...');
    }
  } else {
    console.log('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY not configured');
    console.log('📝 To enable Firestore:');
    console.log('   1. Create Firebase project at https://console.firebase.google.com');
    console.log('   2. Get service account key from Project Settings');
    console.log('   3. Update .env with FIREBASE_SERVICE_ACCOUNT_KEY');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
}

// Create mock objects if not initialized (for development without credentials)
const db = firebaseInitialized ? admin.firestore() : {
  collection: (name) => ({
    add: async (data) => ({
      get: async () => ({ 
        id: 'test-' + Date.now(), 
        data: () => ({ ...data, createdAt: new Date() }), 
        exists: true 
      })
    }),
    doc: (id) => ({
      get: async () => ({ exists: false }),
      update: async (data) => console.log('Mock update:', data),
      delete: async () => console.log('Mock delete')
    }),
    where: (field, op, value) => ({
      orderBy: (field, dir) => ({
        limit: (n) => ({
          get: async () => ({
            forEach: () => {},
            docs: []
          })
        })
      })
    }),
    orderBy: (field, dir) => ({
      limit: (n) => ({
        get: async () => ({
          forEach: () => {},
          docs: []
        })
      })
    })
  })
};

const storage = firebaseInitialized ? admin.storage() : {
  bucket: () => ({
    file: () => ({
      save: async (data) => console.log('Mock save'),
      download: async () => console.log('Mock download')
    })
  })
};

const auth = firebaseInitialized ? admin.auth() : {
  createUser: async (data) => ({ uid: 'test-' + Date.now() }),
  getUserByEmail: async (email) => null
};

console.log(`\n📱 DisasterOps Backend Initialize\n   Firebase: ${firebaseInitialized ? '✅ Connected' : '⚠️ Mock Mode (Dev Only)'}\n`);

module.exports = { admin, db, storage, auth, firebaseInitialized };
