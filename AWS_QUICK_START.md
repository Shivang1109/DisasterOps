# ⚡ AWS Deployment - Quick Start

## 📦 FILES READY

✅ **Backend**: `disasterops-backend.zip` (29 KB)  
✅ **Frontend**: `frontend/dist/` (524 KB)

---

## 🚀 FASTEST DEPLOYMENT (5 minutes)

### Step 1: Deploy Backend (Elastic Beanstalk)

```bash
# 1. Go to: https://console.aws.amazon.com/elasticbeanstalk/
# 2. Click "Create Application"
# 3. Upload: disasterops-backend.zip
# 4. Platform: Node.js 20
# 5. Add these environment variables:

PORT=8080
NODE_ENV=production
MONGO_URI=mongodb+srv://shubhamsingh164572_db_user:Shubham164573_01@cluster0.zntyhwd.mongodb.net/?appName=Cluster0
GEMINI_API_KEY=<your_key>
JWT_SECRET=your_jwt_secret_change_in_production_2024
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# 6. Click "Create environment"
# 7. Wait 5 minutes
# 8. Copy URL: http://disasterops-prod.us-east-1.elasticbeanstalk.com
```

### Step 2: Deploy Frontend (S3)

```bash
# 1. Go to: https://s3.console.aws.amazon.com/s3/
# 2. Create bucket: "disasterops-frontend"
# 3. Uncheck "Block all public access"
# 4. Upload all files from frontend/dist/
# 5. Properties → Static website hosting → Enable
# 6. Index document: index.html
# 7. Error document: index.html
# 8. Permissions → Bucket policy → Paste:

{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::disasterops-frontend/*"
  }]
}

# 9. Copy website endpoint URL
```

### Step 3: Connect Frontend to Backend

```bash
# 1. Edit frontend/src/config.js:
export const API_URL = 'http://disasterops-prod.us-east-1.elasticbeanstalk.com';

# 2. Rebuild:
cd frontend
npm run build

# 3. Re-upload dist/ to S3
```

---

## ✅ VERIFICATION

```bash
# Test backend
curl http://disasterops-prod.us-east-1.elasticbeanstalk.com/health

# Test frontend
open http://disasterops-frontend.s3-website-us-east-1.amazonaws.com
```

---

## 🎯 ENVIRONMENT VARIABLES CHECKLIST

Copy these to AWS Elastic Beanstalk:

- [ ] PORT=8080
- [ ] NODE_ENV=production
- [ ] MONGO_URI=<your_mongodb_uri>
- [ ] GEMINI_API_KEY=<your_gemini_key>
- [ ] JWT_SECRET=<your_secret>
- [ ] GOOGLE_MAPS_API_KEY=<optional>
- [ ] FIREBASE_SERVICE_ACCOUNT_KEY=<optional>

---

## 🔥 IMPORTANT NOTES

1. **PORT must be 8080** (not 5005) for Elastic Beanstalk
2. **MongoDB Atlas**: Add `0.0.0.0/0` to IP whitelist for AWS
3. **Gemini quota**: Wait 24 hours or enable billing
4. **CORS**: Update server.js with your S3 URL after deployment

---

## 📞 NEED HELP?

See full guide: `AWS_DEPLOYMENT_GUIDE.md`
