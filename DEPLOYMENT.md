# 🚀 DisasterOps Deployment Guide

## Live Application
- **Frontend**: https://disaster-ops-one.vercel.app
- **Backend**: https://disasterops.onrender.com
- **GitHub**: https://github.com/Shivang1109/DisasterOps

---

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Vercel (HTTPS) │ ◄─────► │ Render (HTTPS)   │ ◄─────► │ MongoDB Atlas   │
│  React Frontend │         │ Node.js Backend  │         │ Database        │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │ Google Gemini AI │
                            │ Triage System    │
                            └──────────────────┘
```

---

## Backend Deployment (Render)

### Platform: Render.com
- **URL**: https://disasterops.onrender.com
- **Plan**: Free tier
- **Auto-deploy**: Yes (from GitHub main branch)
- **Sleep**: After 15 min inactivity (wakes in ~30 sec)

### Configuration
- **Runtime**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Port**: 8080

### Environment Variables (7 required)
```
PORT=8080
NODE_ENV=production
MONGO_URI=mongodb+srv://...
GEMINI_API_KEY=AIzaSy...
JWT_SECRET=your_jwt_secret...
GOOGLE_MAPS_API_KEY=YOUR_KEY
FIREBASE_SERVICE_ACCOUNT_KEY={...}
```

### How to Redeploy
1. Push changes to GitHub main branch
2. Render auto-deploys in ~2-3 minutes
3. Or manually: Render Dashboard → Manual Deploy

---

## Frontend Deployment (Vercel)

### Platform: Vercel
- **URL**: https://disaster-ops-one.vercel.app
- **Plan**: Free tier (Hobby)
- **Auto-deploy**: Yes (from GitHub main branch)
- **Framework**: Vite (React)

### Configuration
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables (1 required)
```
VITE_API_URL=https://disasterops.onrender.com
```

### How to Redeploy
1. Push changes to GitHub main branch
2. Vercel auto-deploys in ~30 seconds
3. Or manually: Vercel Dashboard → Deployments → Redeploy

---

## Database (MongoDB Atlas)

### Platform: MongoDB Atlas
- **Plan**: Free tier (M0)
- **Region**: Closest to your users
- **Connection**: Via MONGO_URI environment variable

### Important Settings
- **Network Access**: Add `0.0.0.0/0` to IP whitelist (allow all)
- **Database User**: Created with read/write permissions
- **Connection String**: Stored in Render environment variables

---

## Initial Setup (One-time)

### 1. Backend Setup (Render)
```bash
1. Go to https://render.com
2. Sign up with GitHub
3. New Web Service → Connect DisasterOps repo
4. Configure:
   - Name: disasterops-backend
   - Runtime: Node
   - Build: npm install
   - Start: node server.js
   - Plan: Free
5. Add 7 environment variables
6. Deploy
7. Copy URL: https://disasterops.onrender.com
```

### 2. Frontend Setup (Vercel)
```bash
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import Project → DisasterOps repo
4. Configure:
   - Framework: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
5. Add environment variable:
   - VITE_API_URL=https://disasterops.onrender.com
6. Deploy
7. Get URL: https://disaster-ops-one.vercel.app
```

### 3. Update Backend CORS (Already Done)
The backend `server.js` already includes Vercel domain in CORS:
```javascript
app.use(cors({
  origin: [
    'https://disaster-ops-one.vercel.app',
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
```

---

## Making Changes

### Backend Changes
```bash
# Make changes to backend code
git add .
git commit -m "feat: your changes"
git push

# Render auto-deploys in 2-3 minutes
# Check: https://dashboard.render.com
```

### Frontend Changes
```bash
# Make changes to frontend code
cd frontend
npm run build  # Test locally
cd ..

git add .
git commit -m "feat: your changes"
git push

# Vercel auto-deploys in 30 seconds
# Check: https://vercel.com/dashboard
```

---

## Monitoring & Logs

### Backend Logs (Render)
1. Go to https://dashboard.render.com
2. Click on **disasterops-backend**
3. Go to **Logs** tab
4. View real-time logs

### Frontend Logs (Vercel)
1. Go to https://vercel.com/dashboard
2. Click on **disaster-ops-one**
3. Go to **Deployments** → Click deployment
4. View build logs and runtime logs

---

## Troubleshooting

### Backend Not Responding
1. Check if service is sleeping (free tier)
2. Visit URL to wake it up (~30 seconds)
3. Check Render logs for errors
4. Verify MongoDB connection (IP whitelist)
5. Verify environment variables are set

### Frontend Not Loading
1. Check Vercel deployment status
2. Verify build succeeded
3. Check browser console for errors
4. Verify VITE_API_URL is set correctly
5. Clear browser cache

### CORS Errors
1. Verify Vercel domain in backend CORS config
2. Check both frontend and backend are HTTPS
3. Redeploy backend after CORS changes

### Database Connection Failed
1. Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Verify MONGO_URI is correct in Render env vars
3. Check MongoDB Atlas cluster is running
4. Verify database user has correct permissions

---

## Performance Tips

### Keep Backend Awake
Use UptimeRobot (free) to ping backend every 10 minutes:
1. Sign up at https://uptimerobot.com
2. Add monitor: `https://disasterops.onrender.com/health`
3. Interval: 10 minutes
4. Backend never sleeps!

### Optimize Frontend
- Already using Vite for fast builds
- Assets are minified and gzipped
- React production build enabled
- Vercel CDN for global distribution

---

## Cost Breakdown

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| Render | Free | $0/month | 750 hours, sleeps after 15 min |
| Vercel | Hobby | $0/month | Unlimited bandwidth, auto-deploy |
| MongoDB Atlas | M0 | $0/month | 512 MB storage, shared cluster |
| Google Gemini | Free | $0/month | Rate limited, 50 requests/day |

**Total**: $0/month for demo and GDG submission! 🎉

---

## Production Upgrade (Optional)

If you need to upgrade for production use:

### Render ($7/month)
- No sleep
- More CPU/RAM
- Custom domains
- Better performance

### Vercel ($20/month)
- Team features
- More bandwidth
- Analytics
- Priority support

### MongoDB Atlas ($9/month)
- M10 cluster
- More storage
- Better performance
- Automated backups

---

## Security Notes

✅ **HTTPS**: Both frontend and backend use HTTPS  
✅ **CORS**: Properly configured for Vercel domain  
✅ **Environment Variables**: Secrets stored securely  
✅ **MongoDB**: IP whitelist configured  
✅ **JWT**: Authentication tokens for API security  

---

## Support

- **GitHub Issues**: https://github.com/Shivang1109/DisasterOps/issues
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

**Deployed and ready for GDG Solutions Challenge! 🚀**
