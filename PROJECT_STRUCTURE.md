# 📁 DisasterOps - Project Structure

## Clean Folder Structure

```
DisasterOps/
├── 📂 config/                    # Configuration files
│   └── db.js                     # MongoDB connection
│
├── 📂 controllers/               # Route controllers
│   ├── authController.js         # Authentication logic
│   └── incidentController.js     # Incident CRUD operations
│
├── 📂 frontend/                  # React frontend application
│   ├── 📂 public/                # Static assets
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── 📂 src/                   # Source code
│   │   ├── 📂 assets/            # Images
│   │   ├── 📂 components/        # React components
│   │   │   ├── AdminInterface.jsx
│   │   │   ├── ChatWidget.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FloatingReportButton.jsx
│   │   │   ├── GoogleMap.jsx
│   │   │   ├── IncidentForm.jsx
│   │   │   ├── IncidentStatusTracker.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Map.jsx
│   │   │   ├── ProviderInterface.jsx
│   │   │   └── RoleSelection.jsx
│   │   ├── App.css              # App styles
│   │   ├── App.jsx              # Main app component
│   │   ├── config.js            # API configuration
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # Entry point
│   ├── .env.development         # Dev environment
│   ├── .env.example             # Environment template
│   ├── .env.production          # Production environment
│   ├── .gitignore               # Frontend git ignore
│   ├── eslint.config.js         # ESLint configuration
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend dependencies
│   ├── README.md                # Frontend documentation
│   ├── vercel.json              # Vercel deployment config
│   └── vite.config.js           # Vite configuration
│
├── 📂 models/                    # Database models
│   └── Incident.js               # Incident schema
│
├── 📂 routes/                    # API routes
│   ├── authRoutes.js             # Authentication endpoints
│   └── incidentRoutes.js         # Incident endpoints
│
├── 📂 screenshots/               # Demo images
│   ├── admin_hud.png
│   ├── citizen_dashboard.png
│   ├── login.png
│   └── service_commissioning.png
│
├── 📂 services/                  # External services
│   └── geminiAI.js               # Google Gemini AI integration
│
├── 📂 sockets/                   # WebSocket handlers
│   └── index.js                  # Socket.IO configuration
│
├── 📄 .env                       # Environment variables (local)
├── 📄 .env.example               # Environment template
├── 📄 .gitignore                 # Git ignore rules
├── 📄 DEPLOYMENT.md              # Deployment guide
├── 📄 DEPLOYMENT_SUMMARY.md      # Quick deployment status
├── 📄 FINAL_STEPS.md             # Testing and verification
├── 📄 NEXT_STEPS.md              # GDG submission checklist
├── 📄 package.json               # Backend dependencies
├── 📄 package-lock.json          # Dependency lock file
├── 📄 PROJECT_STRUCTURE.md       # This file
├── 📄 README.md                  # Main documentation
├── 📄 render.yaml                # Render deployment config
├── 📄 server.js                  # Main backend server
├── 📄 TESTING_GUIDE.md           # Testing instructions
├── 📄 users.csv                  # User data (empty, for app)
└── 📄 users.csv.example          # User data template
```

---

## File Descriptions

### Backend Core
- **server.js** - Express server, Socket.IO setup, middleware
- **render.yaml** - Render.com deployment configuration

### Configuration
- **config/db.js** - MongoDB Atlas connection with Mongoose

### Controllers (Business Logic)
- **controllers/authController.js** - Login/registration logic
- **controllers/incidentController.js** - CRUD operations for incidents

### Models (Database Schemas)
- **models/Incident.js** - Incident schema with location, type, status, AI triage

### Routes (API Endpoints)
- **routes/authRoutes.js** - POST /api/auth/login
- **routes/incidentRoutes.js** - GET/POST/PUT /api/incidents

### Services (External APIs)
- **services/geminiAI.js** - Google Gemini AI integration for triage

### Sockets (Real-time)
- **sockets/index.js** - Socket.IO events, live tracking, notifications

### Frontend
- **frontend/src/App.jsx** - Main React component with routing
- **frontend/src/config.js** - API URL configuration
- **frontend/src/components/** - All React components
- **frontend/vercel.json** - Vercel deployment configuration

### Documentation
- **README.md** - Project overview, features, setup
- **DEPLOYMENT.md** - Complete deployment guide (Render + Vercel)
- **DEPLOYMENT_SUMMARY.md** - Quick status and architecture
- **TESTING_GUIDE.md** - Feature testing instructions
- **NEXT_STEPS.md** - GDG submission checklist
- **FINAL_STEPS.md** - Final testing and verification
- **PROJECT_STRUCTURE.md** - This file

### Environment
- **.env** - Local environment variables (not in git)
- **.env.example** - Template for environment variables
- **users.csv** - User data storage (not in git)
- **users.csv.example** - Template for user data

---

## Key Technologies by Folder

### Backend (`/`)
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **Mongoose** - MongoDB ODM
- **Google Gemini AI** - AI triage

### Frontend (`/frontend`)
- **React 19** - UI framework
- **Vite** - Build tool
- **Leaflet** - Maps
- **Lucide Icons** - Icons
- **CSS3** - Styling (Glassmorphism)

### Database
- **MongoDB Atlas** - Cloud database

### Deployment
- **Render** - Backend hosting
- **Vercel** - Frontend hosting

---

## Ignored Files/Folders

These are in `.gitignore` and not tracked:

```
node_modules/           # Backend dependencies
frontend/node_modules/  # Frontend dependencies
frontend/dist/          # Frontend build output
.env                    # Environment variables
users.csv               # User data
.vscode/                # Editor settings
*.log                   # Log files
.DS_Store               # macOS files
```

---

## Total File Count

- **Backend**: 12 files (excluding node_modules)
- **Frontend**: 20+ files (excluding node_modules, dist)
- **Documentation**: 7 markdown files
- **Configuration**: 5 files (.env, .gitignore, etc.)
- **Screenshots**: 4 images

**Total**: ~50 essential files (clean and organized!)

---

## Code Statistics

```
Backend:
- JavaScript: ~1,500 lines
- Configuration: ~100 lines

Frontend:
- JavaScript/JSX: ~3,000 lines
- CSS: ~1,000 lines
- Configuration: ~50 lines

Documentation:
- Markdown: ~2,000 lines

Total: ~7,650 lines of code
```

---

## Dependencies

### Backend (package.json)
- express
- socket.io
- mongoose
- cors
- dotenv
- @google/generative-ai

### Frontend (frontend/package.json)
- react
- react-dom
- leaflet
- react-leaflet
- lucide-react
- socket.io-client

---

## Clean and Professional! ✅

This structure is:
- ✅ **Organized** - Clear separation of concerns
- ✅ **Documented** - Comprehensive guides
- ✅ **Production-ready** - Deployed and tested
- ✅ **Maintainable** - Easy to understand and extend
- ✅ **Professional** - Ready for GDG submission

---

*Last Updated: April 27, 2026*
