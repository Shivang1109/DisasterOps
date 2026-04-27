# 🔄 Redeploy Backend to AWS (CORS Fix)

## 🎯 WHY REDEPLOY?

Your frontend on Vercel (`https://disaster-ops-one.vercel.app`) can't connect to the backend because of CORS restrictions. We've fixed the code, now we need to redeploy.

---

## 🚀 OPTION 1: Upload New Zip (Fastest - 2 minutes)

### **Step 1: Go to AWS Elastic Beanstalk**
https://console.aws.amazon.com/elasticbeanstalk/

### **Step 2: Select Your Environment**
- Click on **"DisasterOps-env"**

### **Step 3: Upload New Version**
- Click **"Upload and deploy"** button (orange button, top right)
- Click **"Choose file"**
- Select: `/Users/shivangpathak/Desktop/DisasterOps/disasterops-backend.zip`
- Version label: `v2-cors-fix`
- Click **"Deploy"**

### **Step 4: Wait for Deployment**
- Takes 2-3 minutes
- Status will show: Updating → Ok (green)

### **Step 5: Test**
- Go to: `https://disaster-ops-one.vercel.app`
- Try logging in again
- Should work now! ✅

---

## 🚀 OPTION 2: Use AWS CLI (Alternative)

```bash
cd /Users/shivangpathak/Desktop/DisasterOps

# Create application version
aws elasticbeanstalk create-application-version \
  --application-name DisasterOps \
  --version-label v2-cors-fix \
  --source-bundle S3Bucket="elasticbeanstalk-ap-south-1-YOUR_ACCOUNT_ID",S3Key="disasterops-backend.zip"

# Update environment
aws elasticbeanstalk update-environment \
  --environment-name DisasterOps-env \
  --version-label v2-cors-fix
```

---

## ✅ WHAT WE FIXED

### **1. Express CORS**
```javascript
app.use(cors({
  origin: [
    'https://disaster-ops-one.vercel.app',  // ← Added Vercel URL
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

### **2. Socket.IO CORS**
```javascript
const io = new Server(server, {
  cors: { 
    origin: [
      'https://disaster-ops-one.vercel.app',  // ← Added Vercel URL
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
});
```

---

## 🧪 AFTER REDEPLOYMENT

### **Test 1: Health Check**
```
http://DisasterOps-env.ebs-ffq37ztk-ap-south-1.elasticbeanstalk.com/health
```
Should return: `{"status":"ok","db":"mongodb"}`

### **Test 2: Login on Vercel**
```
https://disaster-ops-one.vercel.app
```
- Try logging in with: `134567` / `asdfghjk`
- Should work without "COMMUNICATION FAILURE" error

### **Test 3: Submit SOS**
- Login as citizen
- Click "BROADCAST SOS"
- Fill form and submit
- Should work! ✅

---

## 🔍 IF STILL NOT WORKING

### **Check 1: MongoDB IP Whitelist**
1. Go to: https://cloud.mongodb.com/
2. Network Access → Add IP: `0.0.0.0/0`
3. Wait 2-3 minutes

### **Check 2: Environment Variables**
1. AWS Console → DisasterOps-env → Configuration
2. Software → Environment properties
3. Verify `PORT=8080` (not 5005)

### **Check 3: Logs**
1. AWS Console → DisasterOps-env → Logs
2. Request Logs → Last 100 Lines
3. Look for errors

---

## 📋 QUICK CHECKLIST

- [ ] New zip file created (29 KB)
- [ ] Go to AWS Elastic Beanstalk console
- [ ] Click "Upload and deploy"
- [ ] Select `disasterops-backend.zip`
- [ ] Wait 2-3 minutes for deployment
- [ ] Test Vercel app login
- [ ] Verify "COMMUNICATION FAILURE" is gone
- [ ] Test all features work

---

**Upload the new zip now and your app will work!** 🚀
