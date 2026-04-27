# DisasterOps v2.0 - Google Solutions Challenge Implementation Guide

## 🎯 Status: ✅ Implementation Complete

All code files have been generated and dependencies installed. Follow these steps to get to production.

---

## 📋 Phase 1: Google Cloud & Firebase Setup (30 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create Project"**
3. Name: `DisasterOps` or `Shubhshastra`
4. **Enable Google Analytics** (recommended for tracking)
5. **Create Project**

### Step 2: Enable Required Services
In Firebase Console → Project Settings:

**Enable these services:**
- ✅ Firestore Database (Production mode)
- ✅ Firebase Storage (for media uploads)
- ✅ Firebase Authentication
- ✅ Firebase Hosting

**In Google Cloud Console (same project):**
- ✅ Enable Vision API (for Vertex AI image analysis)
- ✅ Enable Cloud Run API (for backend deployment)
- ✅ Enable Cloud Storage API

### Step 3: Get Service Account Key
1. Firebase Console → Project Settings → Service Accounts tab
2. Click **"Generate New Private Key"** (JSON format)
3. Save the file securely
4. Copy the entire JSON content

### Step 4: Get Firebase Config for Frontend
1. Firebase Console → Project Settings → General tab
2. Scroll to "Your apps" section
3. Click the web app
4. Copy the Firebase config object

---

## ⚙️ Phase 2: Configure Environment Variables

### Backend Configuration (.env)

Replace placeholders in `/DisasterOps/.env`:

```env
# Replace: YOUR_PROJECT_ID = your Firebase project ID
# Replace: YOUR_API_KEY = From service account JSON file
# Replace: YOUR_PRIVATE_KEY = From service account JSON file (keep \n for newlines)
# Replace: YOUR_SERVICE_ACCOUNT_EMAIL = From service account JSON file
# Replace: YOUR_GOOGLE_MAPS_API_KEY = From Google Cloud Console
```

**Quick Fill (Safe Method):**
```bash
cd /Users/shivangpathak/Desktop/DisasterOps

# 1. Open .env in your editor
# 2. Replace Firebase service account JSON (entire content)
# 3. Replace GOOGLE_MAPS_API_KEY with your Maps API key
```

### Frontend Configuration (frontend/.env.local)

Create `/DisasterOps/frontend/.env.local`:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
VITE_API_URL=http://localhost:5005/api
```

---

## 🚀 Phase 3: Run Locally (Testing)

### Terminal 1: Backend
```bash
cd /Users/shivangpathak/Desktop/DisasterOps
npm run dev
# Server running on :5005 ✅
```

### Terminal 2: Frontend
```bash
cd /Users/shivangpathak/Desktop/DisasterOps/frontend
npm run dev
# Vite running on http://localhost:5173 ✅
```

### Terminal 3: Test API (Optional)
```bash
# Test health endpoint
curl http://localhost:5005/health

# Create test incident
curl -X POST http://localhost:5005/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "type": "fire",
    "description": "Test incident",
    "location": { "lat": 28.6139, "lng": 77.2090 },
    "severity": "high",
    "contactNumber": "9999999999"
  }'
```

---

## 🌐 Phase 4: Deploy to Firebase (Production)

### Option A: Firebase Hosting (Frontend) + Cloud Run (Backend)

**Prerequisites:**
```bash
npm install -g firebase-tools
firebase login  # Authenticate with your Google account
```

**Update firebase.json and deploy:**

```bash
# From project root
firebase init hosting  # Choose "Use existing project"

# Build frontend
cd frontend
npm run build
cd ..

# Deploy
firebase deploy --only hosting
```

**Your URL:** `https://YOUR_PROJECT_ID.firebaseapp.com`

### Option B: Backend Deployment (Cloud Run)

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5005
CMD ["npm", "start"]
```

2. **Deploy:**
```bash
gcloud run deploy disasterops-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

3. **Update frontend API URL:**
```env
VITE_API_URL=https://YOUR_CLOUD_RUN_URL/api
```

---

## 📁 File Structure (After Implementation)

```
DisasterOps/
├── config/
│   ├── db.js              # Old MongoDB (keeping for reference)
│   └── firebase.js        # ✨ NEW - Firebase Admin SDK
├── controllers/
│   ├── authController.js
│   └── incidentController.js  # ✅ UPDATED - Firestore-based
├── services/
│   └── vertexAI.js        # ✨ NEW - Google Vision AI integration
├── sockets/
│   └── index.js
├── routes/
│   ├── authRoutes.js
│   └── incidentRoutes.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GoogleMap.jsx  # ✨ NEW - Google Maps
│   │   │   ├── AdminInterface.jsx
│   │   │   ├── ProviderInterface.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ...other components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example       # ✨ NEW - Frontend env template
│   ├── .env.local         # CREATE THIS - Your Firebase config
│   └── package.json       # ✅ UPDATED
├── package.json           # ✅ UPDATED - Firebase & Google Cloud deps
├── server.js              # ✅ UPDATED - Firebase initialization
├── .env                   # ✅ UPDATED - Firebase credentials
├── firebase.json          # ✨ NEW - Hosting config
└── .firebaserc            # ✨ NEW - Firebase project reference
```

---

## 🔑 Key Features Implemented

### Backend
- ✅ **Firebase Firestore** - Replaces MongoDB with real-time NoSQL database
- ✅ **Google Cloud Vision API** - Automatic image analysis for incidents
- ✅ **Real-time Socket.IO** - Live updates and smart routing
- ✅ **Smart Incident Routing** - Routes incidents to correct provider types

### Frontend  
- ✅ **Google Maps Integration** - Real-time incident markers and heatmaps
- ✅ **Responsive Design** - Mobile-first UI with Lucide icons
- ✅ **Role-Based Dashboards** - Citizen, Provider, Admin interfaces
- ✅ **Live Chat Widget** - Direct messaging between responders and citizens

### DevOps
- ✅ **Firebase Hosting** - Automatic HTTPS, CDN, global distribution
- ✅ **Cloud Run** - Auto-scaling backend deployment
- ✅ **Service Account Auth** - Secure Google Cloud integration

---

## 🧪 Quick Testing Checklist

- [ ] Backend runs: `npm run dev` (Port 5005)
- [ ] Frontend runs: `npm run dev` (Port 5173)
- [ ] Can access `http://localhost:5173`
- [ ] Can log in (test credentials from users.csv)
- [ ] Can select role (Citizen/Provider/Admin)
- [ ] Can report incident as Citizen
- [ ] Incident appears on map with Google Maps
- [ ] Provider receives real-time alert
- [ ] Admin dashboard shows all incidents
- [ ] Chat widget works between user and provider

---

## 🚨 Common Issues & Solutions

### Issue: Firebase credentials error
**Solution:** Ensure `.env` has properly formatted JSON (keep `\n` for newlines)

### Issue: Google Maps API not loading
**Solution:** Add API key to `VITE_GOOGLE_MAPS_API_KEY` in frontend .env.local

### Issue: Socket.IO connection refused
**Solution:** Ensure backend is running on port 5005 and CORS is enabled

### Issue: Firestore permissions denied
**Solution:** In Firebase Console → Firestore → Rules, set to production mode with read/write

---

## 📊 Deployment Checklist (Before Submission)

- [ ] All 3 roles working end-to-end
- [ ] Google Maps showing incidents
- [ ] Vertex AI analyzing images (check logs)
- [ ] Real-time updates via Socket.IO
- [ ] Mobile responsive (test on mobile)
- [ ] Error handling on all forms
- [ ] Loading states on buttons
- [ ] Analytics tracking active
- [ ] Deployed to Firebase Hosting
- [ ] Backend on Cloud Run
- [ ] Custom domain (optional)
- [ ] README updated with deployment URL

---

## 🏆 Hackathon Submission

**Submission should include:**
1. ✅ Deployed URL (Firebase Hosting)
2. ✅ Github repository link
3. ✅ Architecture diagram (use included Mermaid diagrams)
4. ✅ Demo video (2-3 min walkthrough)
5. ✅ Explanation of Google Cloud integration

**Winning criteria for Google Solutions Challenge:**
- Real-time disaster response ✅
- Google Cloud services usage ✅  
- Scalable architecture ✅
- User-centered design ✅
- Social impact ✅

---

## 📞 Support & Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Google Cloud Vision:** https://cloud.google.com/vision/docs
- **Cloud Run:** https://cloud.google.com/run/docs
- **React Google Maps:** https://react-google-maps-api-docs.netlify.app/

---

**Version:** 2.0 (Google Solutions Challenge)
**Last Updated:** April 21, 2026
**Status:** ✅ Ready for Deployment

Good luck with the hackathon! 🚀
