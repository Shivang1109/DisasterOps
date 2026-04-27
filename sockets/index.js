const { Server } = require('socket.io');

// For tracking non-provider user locations for Haversine filtering
const connectedUsers = new Map(); // socket.id -> { lat, lng }

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { 
      origin: [
        'https://disaster-ops-one.vercel.app',
        'http://localhost:5173'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  // Initialize global activeProviders storage
  if (!global.activeProviders) global.activeProviders = {};

  const broadcastProviders = () => {
    const providersList = Object.values(global.activeProviders || {});
    // Broadcast to everyone (not just admin)
    io.emit('providers_update', providersList);
    console.log(`📡 Broadcasting ${providersList.length} active providers`);
  };

  io.on('connection', (socket) => {
    console.log(`Connection: ${socket.id}`);

    // Join specialized rooms for role-based routing
    socket.on('join_service', (roleData) => {
      const { role, providerType } = roleData;
      if (role === 'admin') {
        socket.join('admin');
      } else if (role === 'provider' && providerType) {
        socket.join(providerType);
        // Also joining 'ambulance' room if it's gov or pvt for easier routing
        if (providerType.includes('ambulance')) socket.join('ambulance');
      }
      console.log(`Socket ${socket.id} joined rooms:`, Array.from(socket.rooms));
    });

    socket.on('update_location', (data) => {
      const { lat, lng, role, providerType } = data;
      if (!lat || !lng) return;

      // Store all user locations in connectedUsers
      if (typeof lat === 'number' && typeof lng === 'number') {
        connectedUsers.set(socket.id, { 
          lat, 
          lng, 
          role: role || 'user', 
          providerType: providerType || null 
        });
      }

      // Store provider location in global memory for live tracking
      const providerId = socket.id;
      if (role === 'provider') {
        global.activeProviders[providerId] = {
          id: providerId,
          lat,
          lng,
          providerType,
          lastSeen: new Date(),
          status: 'active'
        };
        console.log(`🚗 Provider ${providerType} location updated: [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
      }

      // Broadcast updated providers list to everyone
      broadcastProviders();
    });

    socket.on('send_chat_message', (msg) => {
      console.log(`Chat Message:`, msg);
      // Broadcast to everyone else for the prototype (ideally target specifically)
      socket.broadcast.emit('chat_message', msg);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnect: ${socket.id}`);
      connectedUsers.delete(socket.id);
      
      // Remove from active providers
      if (global.activeProviders && global.activeProviders[socket.id]) {
        delete global.activeProviders[socket.id];
        broadcastProviders();
      }
    });
  });

  return io;
};

const notifyNearbyUsers = (io, incident) => {
  if (!incident || !incident.location) return;
  const incidentLat = incident.location.lat;
  const incidentLng = incident.location.lng;
  const type = incident.type;

  // 1. Alert ALL Admins
  io.to('admin').emit('red_alert', incident);

  // 2. Alert Specific Service Providers (The Brain Routing)
  console.log(`Routing Incident Type: ${type}`);
  if (type === 'fire') {
    console.log('Emitting to fire_engine room');
    io.to('fire_engine').emit('red_alert', incident);
  } else if (type === 'flood') {
    io.to('ndrf').emit('red_alert', incident);
  } else if (type === 'earthquake') {
    io.to('sdrf').emit('red_alert', incident);
  } else if (type === 'gas_leak') {
    io.to('hazmat_team').emit('red_alert', incident);
  } else if (type === 'trapped') {
    io.to('rescue_squad').emit('red_alert', incident);
  } else if (type === 'missing_person') {
    io.to('cid').emit('red_alert', incident);
  } else if (type === 'cyber_threat') {
    io.to('cyber_cell').emit('red_alert', incident);
  } else if (type === 'medical' || type === 'accident') {
    console.log('Emitting to ambulance rooms');
    io.to('gov_ambulance').emit('red_alert', incident);
    io.to('private_ambulance').emit('red_alert', incident);
  } else if (type === 'crime' || type === 'other') {
    console.log('Emitting to police room');
    io.to('police').emit('red_alert', incident);
  }

  // 3. Alert Regular Users within 5km Radius
  for (const [socketId, userLoc] of connectedUsers.entries()) {
    if (userLoc.role === 'user') {
      const distance = calculateDistance(incidentLat, incidentLng, userLoc.lat, userLoc.lng);
      if (distance <= 5) {
        io.to(socketId).emit('red_alert', incident);
      }
    }
  }
};

module.exports = { initSocket, notifyNearbyUsers };
