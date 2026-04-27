# 🎨 Frontend Deployment Guide

## ✅ BACKEND IS LIVE!

**Backend URL**: `http://DisasterOps-env.ebs-ffq37ztk-ap-south-1.elasticbeanstalk.com`

**Status**: ✅ Deployed and running on AWS Elastic Beanstalk

---

## 🚀 DEPLOY FRONTEND - 3 OPTIONS

### **OPTION 1: Vercel (Easiest - 2 minutes)**

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **Import Project**:
   - Click "Add New" → "Project"
   - Select repository: `Shivang1109/DisasterOps`
   - Root Directory: `frontend`
4. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. **Environment Variables**:
   ```
   VITE_API_URL=http://DisasterOps-env.ebs-ffq37ztk-ap-south-1.elasticbeanstalk.com
   ```
6. **Deploy**: Click "Deploy"
7. **Done!** Copy your Vercel URL (e.g., `https://disaster-ops.vercel.app`)

---

### **OPTION 2: AWS S3 + CloudFront (Professional)**

#### **Step 1: Create S3 Bucket**

```bash
# Go to: https://s3.console.aws.amazon.com/s3/
# Click "Create bucket"
# Bucket name: disasterops-frontend
# Region: ap-south-1 (Mumbai)
# Uncheck "Block all public access"
# Click "Create bucket"
```

#### **Step 2: Upload Files**

```bash
# Option A: Using AWS Console
# 1. Open bucket → Upload
# 2. Drag all files from frontend/dist/
# 3. Click "Upload"

# Option B: Using AWS CLI (faster)
cd /Users/shivangpathak/Desktop/DisasterOps/frontend
aws s3 sync dist/ s3://disasterops-frontend --acl public-read
```

#### **Step 3: Enable Static Website Hosting**

```bash
# 1. Go to bucket → Properties
# 2. Scroll to "Static website hosting"
# 3. Click "Edit"
# 4. Enable: "Static website hosting"
# 5. Index document: index.html
# 6. Error document: index.html
# 7. Save changes
# 8. Copy the endpoint URL
```

#### **Step 4: Configure Bucket Policy**

```bash
# 1. Go to bucket → Permissions
# 2. Scroll to "Bucket policy"
# 3. Click "Edit"
# 4. Paste this policy:
```

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

#### **Step 5: (Optional) Add CloudFront for HTTPS**

```bash
# 1. Go to: https://console.aws.amazon.com/cloudfront/
# 2. Create distribution
# 3. Origin domain: Select your S3 bucket
# 4. Viewer protocol policy: Redirect HTTP to HTTPS
# 5. Default root object: index.html
# 6. Create distribution
# 7. Wait 10-15 minutes
# 8. Copy CloudFront URL
```

**Your frontend will be at:**
- S3: `http://disasterops-frontend.s3-website.ap-south-1.amazonaws.com`
- CloudFront: `https://d1234567890.cloudfront.net`

---

### **OPTION 3: Netlify (Alternative)**

1. **Go to**: https://netlify.com
2. **Sign in** with GitHub
3. **Add new site** → Import from Git
4. **Select**: `Shivang1109/DisasterOps`
5. **Configure**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
6. **Environment Variables**:
   ```
   VITE_API_URL=http://DisasterOps-env.ebs-ffq37ztk-ap-south-1.elasticbeanstalk.com
   ```
7. **Deploy**: Click "Deploy site"
8. **Done!** Copy your Netlify URL

---

## 🔧 POST-DEPLOYMENT: UPDATE CORS

After deploying frontend, you need to update backend CORS to allow your frontend domain.

### **Update server.js on AWS:**

1. **Go to**: Elastic Beanstalk → DisasterOps-env → Configuration
2. **Edit**: Software → Environment properties
3. **Add new variable**:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
4. **Apply changes**

Or manually update `server.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-url.vercel.app',
    'http://disasterops-frontend.s3-website.ap-south-1.amazonaws.com',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

---

## ✅ VERIFICATION CHECKLIST

After deployment:

- [ ] Frontend loads at your URL
- [ ] Backend health check works: `/health`
- [ ] Login page appears
- [ ] Can create account
- [ ] Can login
- [ ] Can submit SOS
- [ ] Live tracking works
- [ ] Real-time chat works
- [ ] AI triage appears (after quota reset)

---

## 🎯 FINAL STEPS

1. **Test everything** end-to-end
2. **Update README.md** with live URLs:
   ```markdown
   ## 🌐 Live Demo
   
   - **Frontend**: https://disaster-ops.vercel.app
   - **Backend**: http://DisasterOps-env.ebs-ffq37ztk-ap-south-1.elasticbeanstalk.com
   ```
3. **Commit and push** to GitHub
4. **Submit to GDG Solutions Challenge!** 🎉

---

## 📊 CURRENT STATUS

| Component | Status | URL |
|-----------|--------|-----|
| **Backend** | ✅ Live | http://DisasterOps-env.ebs-ffq37ztk-ap-south-1.elasticbeanstalk.com |
| **Frontend** | ⏳ Ready to deploy | `frontend/dist/` (524 KB) |
| **Database** | ✅ MongoDB Atlas | Connected |
| **Gemini AI** | ⏳ Quota reset pending | Will work in 24h |

---

**Choose your deployment option and let's get your frontend live!** 🚀
