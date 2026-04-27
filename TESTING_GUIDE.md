# 🧪 Quick Testing Guide - Live Tracking Features

## ✅ Both Servers Running

**Backend:** http://localhost:5005 ✅  
**Frontend:** http://localhost:5173 ✅

---

## 🎯 Quick Test (5 Minutes)

### **Step 1: Open Two Browser Tabs**

**Tab 1 - Citizen:**
```
URL: http://localhost:5173
Login: citizen1 / 9999999991
Role: User/Citizen
```

**Tab 2 - Provider:**
```
URL: http://localhost:5173
Login: responder1 / 8888888881
Role: Service Provider → Fire Engine
```

---

### **Step 2: Submit SOS (Tab 1 - Citizen)**

1. Fill the SOS form:
   - Type: **Fire**
   - Severity: **High**
   - Description: "Building on fire"
2. Click **"TRANSMIT RED ALERT"**

**✅ Expected:**
- Status tracker appears bottom-right
- Shows "⏳ Locating nearest responder..."
- Blue marker at your location
- Red circle around incident

---

### **Step 3: Accept Mission (Tab 2 - Provider)**

1. See red alert in left sidebar
2. Click on the incident
3. Bottom overlay appears
4. Click **"ACCEPT MISSION"**

**✅ Expected:**
- Button changes to "IN PROGRESS"
- Your vehicle marker (🚗) appears on map
- Console shows: `🚗 Provider fire_engine location updated`

---

### **Step 4: Check Citizen View (Tab 1)**

Switch back to Tab 1

**✅ Expected:**
- Status tracker updates to step 2
- Shows "🚗 Responder en route • Fire Engine dispatched"
- Vehicle marker visible on map (red 🚗)
- Dashed blue line from vehicle to your location
- AI ETA displayed (if available)

---

### **Step 5: Resolve (Tab 2 - Provider)**

1. Click **"MARK AS SOLVED"**

**✅ Expected:**
- Overlay closes
- Incident marked resolved

---

### **Step 6: Check Final Status (Tab 1)**

Switch back to Tab 1

**✅ Expected:**
- Status tracker shows step 3
- "✅ Incident resolved. Stay safe!"
- Red danger circle disappears
- Status badge shows "RESOLVED"

---

## 🎨 What You Should See

### **Citizen View:**
```
┌─────────────────────────────────────┐
│  Map with:                          │
│  • Blue marker (you)                │
│  • Red circle (danger zone)         │
│  • Red 🚗 (responder vehicle)       │
│  • Dashed line (route)              │
└─────────────────────────────────────┘
                                    ┌──────────────┐
                                    │ 📡 YOUR SOS  │
                                    │ STATUS       │
                                    │              │
                                    │ ⏳ → 🚗 → ✅ │
                                    │              │
                                    │ Fire Engine  │
                                    │ en route     │
                                    └──────────────┘
```

### **Provider View:**
```
┌──────────────┐  ┌─────────────────────────────────┐
│ CRISIS FEED  │  │  Map with:                      │
│              │  │  • Your vehicle (🚗)            │
│ 🔥 FIRE      │  │  • Incident markers             │
│ Building on  │  │  • Route lines                  │
│ fire         │  │                                 │
│              │  │  [Mission Control Overlay]      │
│ [CLICK ME]   │  │  🤖 AI TRIAGE                   │
└──────────────┘  │  [ACCEPT] [RESOLVE]             │
                  └─────────────────────────────────┘
```

---

## 🐛 Common Issues & Fixes

### **Issue 1: "Location not available"**
**Fix:** Allow location permissions in browser
```
Chrome: Click 🔒 in address bar → Site settings → Location → Allow
```

### **Issue 2: Vehicle marker not showing**
**Fix:** 
1. Check console for errors
2. Ensure provider is logged in
3. Wait 2-3 seconds for location update
4. Check Network tab for `providers_update` events

### **Issue 3: Status tracker not appearing**
**Fix:**
1. Ensure logged in as "User" role (not provider/admin)
2. Submit at least one SOS
3. Check React DevTools: `myIncidents` should have data

### **Issue 4: Route line not drawing**
**Fix:**
1. Provider must click "Accept Mission"
2. Both locations must be valid coordinates
3. Check `routingTarget` in React DevTools

---

## 📊 Console Logs (What's Normal)

### **Backend Console:**
```
✅ MongoDB Connected
🚀 Server running on port 5005
Connection: 8L9vnjPVHd2UcTKMAAAB
Socket 8L9vnjPVHd2UcTKMAAAB joined rooms: [ ... ]
📡 Broadcasting 1 active providers
🚗 Provider fire_engine location updated: [26.8467, 80.9462]
🚨 Red Alert: fire → fire_engine
🤖 Groq Triage: fire → AI Severity: high (confidence: 0.9)
```

### **Frontend Console:**
```
Location Update: { latitude: 26.8467, longitude: 80.9462 }
Socket connected
Providers update received: [{ id: "...", providerType: "fire_engine", ... }]
```

---

## ✅ Success Criteria

- [ ] Both servers running without errors
- [ ] Can login as citizen and provider
- [ ] SOS submission works
- [ ] Status tracker appears for citizen
- [ ] Vehicle marker appears on map
- [ ] Vehicle marker is animated (pulsing)
- [ ] Route line draws when mission accepted
- [ ] Status updates in real-time
- [ ] AI triage appears after 5-10 seconds
- [ ] Resolution updates status tracker
- [ ] No console errors

---

## 🎥 Screenshot Checklist

For GDG submission, capture:

1. **Citizen Dashboard** - SOS form + map
2. **Status Tracker** - Bottom-right widget
3. **Provider Alert** - Left sidebar with incident
4. **Vehicle Tracking** - Map with 🚗 markers
5. **Mission Control** - Bottom overlay with AI triage
6. **Admin View** - Dual-screen interface
7. **Mobile View** - Responsive design

---

## 🚀 Performance Metrics

**Expected Performance:**
- Socket latency: < 100ms
- Location update frequency: Every 1-5 seconds
- AI triage response: 5-10 seconds
- Map render time: < 1 second
- Status tracker update: Instant

---

## 📞 Need Help?

**Check these files:**
- `sockets/index.js` - Socket broadcasting logic
- `frontend/src/components/Map.jsx` - Vehicle markers
- `frontend/src/components/IncidentStatusTracker.jsx` - Status widget
- `frontend/src/App.jsx` - Location updates

**Useful commands:**
```bash
# Restart backend
npm run dev

# Restart frontend
cd frontend && npm run dev

# Check backend health
curl http://localhost:5005/health

# View backend logs
# (Already visible in Terminal 1)

# View frontend logs
# (Already visible in Terminal 2)
```

---

**Ready to test!** 🎉

Open http://localhost:5173 in two tabs and follow the steps above.
