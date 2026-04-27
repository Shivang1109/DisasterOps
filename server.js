const express = require('express');
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const incidentRoutes = require('./routes/incidentRoutes');
const authRoutes = require('./routes/authRoutes');
const { initSocket } = require('./sockets');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/incidents', incidentRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', db: 'mongodb' }));
app.get('/', (req, res) => res.send('DisasterOps API running'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5005;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
