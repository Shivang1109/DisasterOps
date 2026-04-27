# 🚀 DisasterOps - AWS Deployment Guide

## ✅ PREPARATION COMPLETE

### 📦 Backend Package
- **File**: `disasterops-backend.zip`
- **Size**: 29 KB
- **Location**: `/Users/shivangpathak/Desktop/DisasterOps/disasterops-backend.zip`
- **Status**: ✅ Ready for Elastic Beanstalk

### 🎨 Frontend Build
- **Folder**: `frontend/dist/`
- **Size**: 524 KB
- **Files**: 
  - `index.html` (725 B)
  - `assets/index-DOnI5k_B.js` (487 KB - gzipped: 147 KB)
  - `assets/index-DjG4LwX1.css` (24 KB - gzipped: 9 KB)
  - `favicon.svg`, `icons.svg`
- **Status**: ✅ Ready for S3 + CloudFront

---

## 🔐 ENVIRONMENT VARIABLES FOR AWS

### Required Environment Variables (7 total):

```bash
# Server Configuration
PORT=5005
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# Google Gemini AI
GEMINI_API_KEY=AIzaSy...your_key_here

# Authentication
JWT_SECRET=your_jwt_secret_change_in_production_2024

# Google Services (Optional)
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# Firebase (Optional - for future features)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

---

## 📋 DEPLOYMENT STEPS

### OPTION 1: AWS Elastic Beanstalk (Backend) + S3 (Frontend)

#### **Step 1: Deploy Backend to Elastic Beanstalk**

1. **Go to AWS Console**: https://console.aws.amazon.com/elasticbeanstalk/
2. **Create New Application**:
   - Click "Create Application"
   - Application name: `DisasterOps`
   - Platform: `Node.js`
   - Platform branch: `Node.js 20 running on 64bit Amazon Linux 2023`
   - Application code: Upload `disasterops-backend.zip`

3. **Configure Environment**:
   - Environment name: `disasterops-prod`
   - Domain: `disasterops-prod` (will be: disasterops-prod.us-east-1.elasticbeanstalk.com)

4. **Add Environment Variables**:
   - Go to Configuration → Software → Environment properties
   - Add all 7 variables from above
   - **IMPORTANT**: Set `PORT=8080` (Elastic Beanstalk default)

5. **Configure Instance**:
   - Instance type: `t2.micro` (Free tier eligible)
   - Capacity: Single instance (for testing)

6. **Deploy**:
   - Click "Create environment"
   - Wait 5-10 minutes for deployment
   - Copy the URL (e.g., `http://disasterops-prod.us-east-1.elasticbeanstalk.com`)

#### **Step 2: Deploy Frontend to S3 + CloudFront**

1. **Create S3 Bucket**:
   ```bash
   # Go to: https://s3.console.aws.amazon.com/s3/
   # Click "Create bucket"
   # Bucket name: disasterops-frontend
   # Region: us-east-1
   # Uncheck "Block all public access"
   # Create bucket
   ```

2. **Upload Frontend Files**:
   ```bash
   # Upload all files from frontend/dist/ to the bucket
   # Or use AWS CLI:
   cd /Users/shivangpathak/Desktop/DisasterOps/frontend
   aws s3 sync dist/ s3://disasterops-frontend --acl public-read
   ```

3. **Enable Static Website Hosting**:
   - Go to bucket → Properties → Static website hosting
   - Enable it
   - Index document: `index.html`
   - Error document: `index.html` (for React Router)
   - Copy the endpoint URL

4. **Configure Bucket Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::disasterops-frontend/*"
       }
     ]
   }
   ```

5. **Create CloudFront Distribution** (Optional - for HTTPS):
   - Go to: https://console.aws.amazon.com/cloudfront/
   - Create distribution
   - Origin domain: Select your S3 bucket
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Default root object: `index.html`
   - Create distribution
   - Wait 10-15 minutes for deployment
   - Copy CloudFront URL (e.g., `https://d1234567890.cloudfront.net`)

#### **Step 3: Update Frontend Environment**

1. **Update Frontend Config**:
   - Edit `frontend/src/config.js`:
   ```javascript
   export const API_URL = 'http://disasterops-prod.us-east-1.elasticbeanstalk.com';
   ```

2. **Rebuild and Redeploy**:
   ```bash
   cd frontend
   npm run build
   aws s3 sync dist/ s3://disasterops-frontend --acl public-read
   ```

---

### OPTION 2: AWS Amplify (Easier - All-in-One)

#### **Step 1: Deploy Backend to Amplify**

1. **Go to AWS Amplify**: https://console.aws.amazon.com/amplify/
2. **Create New App** → Backend environments
3. **Connect GitHub**:
   - Select repository: `Shivang1109/DisasterOps`
   - Branch: `main`
   - Root directory: `/` (backend)

4. **Build Settings**:
   ```yaml
   version: 1
   backend:
     phases:
       build:
         commands:
           - npm install
           - npm run build
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - frontend/node_modules/**/*
   ```

5. **Add Environment Variables**:
   - Go to App settings → Environment variables
   - Add all 7 variables

6. **Deploy**:
   - Click "Save and deploy"
   - Wait 5-10 minutes
   - Copy the URLs (backend + frontend)

---

## 🔧 POST-DEPLOYMENT CONFIGURATION

### 1. Update Backend CORS

In `server.js`, update CORS to allow your frontend domain:

```javascript
app.use(cors({
  origin: [
    'http://disasterops-frontend.s3-website-us-east-1.amazonaws.com',
    'https://d1234567890.cloudfront.net',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

### 2. Update Socket.IO CORS

In `server.js`, update Socket.IO CORS:

```javascript
const io = new Server(server, {
  cors: {
    origin: [
      'http://disasterops-frontend.s3-website-us-east-1.amazonaws.com',
      'https://d1234567890.cloudfront.net',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST']
  }
});
```

### 3. Test Deployment

```bash
# Test backend health
curl http://disasterops-prod.us-east-1.elasticbeanstalk.com/health

# Test frontend
open http://disasterops-frontend.s3-website-us-east-1.amazonaws.com
```

---

## 📊 AWS COST ESTIMATE (Free Tier)

| Service | Free Tier | Cost After Free Tier |
|---------|-----------|---------------------|
| **Elastic Beanstalk** | 750 hours/month (t2.micro) | ~$10/month |
| **S3** | 5 GB storage, 20,000 GET requests | $0.023/GB/month |
| **CloudFront** | 1 TB data transfer | $0.085/GB |
| **MongoDB Atlas** | 512 MB free forever | $0 (using existing) |
| **Total** | **$0/month** (first year) | ~$15/month after |

---

## 🎯 FINAL CHECKLIST

### Before Deployment:
- [x] Backend zip created (29 KB)
- [x] Frontend build successful (524 KB)
- [x] Environment variables documented
- [ ] Update CORS in server.js
- [ ] Update Socket.IO CORS
- [ ] Test locally one more time

### After Deployment:
- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] Socket.IO connections work
- [ ] Gemini AI triage works (after quota reset)
- [ ] Update README with live URLs
- [ ] Test all features end-to-end

---

## 🚨 TROUBLESHOOTING

### Backend Issues:

**"Application Error"**
- Check Elastic Beanstalk logs: Environment → Logs → Request Logs
- Verify all environment variables are set
- Check `PORT=8080` (not 5005)

**"Cannot connect to MongoDB"**
- Verify MONGO_URI is correct
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for AWS)

**"Gemini API errors"**
- Wait for quota reset (24 hours)
- Or enable billing in Google Cloud Console

### Frontend Issues:

**"Cannot connect to backend"**
- Update `frontend/src/config.js` with correct backend URL
- Rebuild: `npm run build`
- Redeploy to S3

**"404 on refresh"**
- Set S3 error document to `index.html`
- Or use CloudFront with custom error responses

---

## 📞 SUPPORT

- **AWS Documentation**: https://docs.aws.amazon.com/elasticbeanstalk/
- **Elastic Beanstalk Pricing**: https://aws.amazon.com/elasticbeanstalk/pricing/
- **S3 Pricing**: https://aws.amazon.com/s3/pricing/

---

## 🎉 SUCCESS METRICS

After deployment, you should have:
- ✅ Backend API: `http://disasterops-prod.us-east-1.elasticbeanstalk.com`
- ✅ Frontend: `http://disasterops-frontend.s3-website-us-east-1.amazonaws.com`
- ✅ CloudFront (optional): `https://d1234567890.cloudfront.net`
- ✅ All features working (tracking, chat, AI triage)
- ✅ Ready for GDG Solutions Challenge submission!

---

**Good luck with your AWS deployment! 🚀**

*Last updated: April 27, 2026*
