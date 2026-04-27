import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;

const dangerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const providerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

// Custom vehicle icon with color coding and animation
const createVehicleIcon = (type) => {
  const colors = {
    fire_engine: '#f85149',
    ndrf: '#2f81f7',
    sdrf: '#a371f7',
    gov_ambulance: '#3fb950',
    private_ambulance: '#3fb950',
    police: '#f0883e',
    hazmat_team: '#d2a8ff',
    rescue_squad: '#ffa657',
    cid: '#79c0ff',
    cyber_cell: '#56d364',
  };
  const color = colors[type] || '#ffffff';
  return L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 10px ${color};animation: pulse 2s infinite;">🚗</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

// Helper component to recenter map when selection changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Leaflet Routing Machine Integration Component
function Routing({ from, to }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !from || !to) return;
    
    let routingControl;
    let checkInterval;

    const initRouting = () => {
      if (typeof L.Routing === 'undefined' || !L.Routing.control) {
        console.warn("Leaflet Routing Machine not ready, retrying...");
        return;
      }
      
      clearInterval(checkInterval);

      // Create the routing control
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(from.lat, from.lng),
          L.latLng(to.lat, to.lng)
        ],
        lineOptions: {
          styles: [{ color: '#2f81f7', weight: 8, opacity: 0.9 }]
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => null, // We already have markers
      }).addTo(map);

      // Hide the routing container because it's ugly for a modern HUD
      const container = routingControl.getContainer();
      if (container) {
        container.style.display = 'none';
      }

      routingControlRef.current = routingControl;
    };

    // Poll for L.Routing if not immediately available
    if (typeof L.Routing === 'undefined') {
      checkInterval = setInterval(initRouting, 500);
    } else {
      initRouting();
    }

    return () => {
      clearInterval(checkInterval);
      if (routingControlRef.current && map) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, from.lat, from.lng, to.lat, to.lng]);

  return null;
}

export default function MapComponent({ incidents, userLocation, alerts, providers = [], onSelectIncident = null, role = null, myIncidents = [], routingTarget = null }) {
  const isUser = role === 'user';
  // Zoom in closer for citizens so they can clearly see their own pin
  const zoom = isUser ? 17 : 12;

  return (
    <MapContainer
      center={userLocation ? [userLocation.lat, userLocation.lng] : [26.8467, 80.9462]}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      {userLocation && <ChangeView center={[userLocation.lat, userLocation.lng]} zoom={zoom} />}
      
      {userLocation && routingTarget && <Routing from={userLocation} to={routingTarget.location} />}

      <TileLayer
        url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}"
        attribution='&copy; Google Maps'
      />

      {/* User's own location — always visible for all roles */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>📍 You are here</Popup>
        </Marker>
      )}

      {/* User's OWN SOS circles — only visible to the citizen who filed them */}
      {isUser && myIncidents.map((inc) => (
        <React.Fragment key={inc._id}>
          {/* Light red 20m danger zone around the user's SOS location */}
          {inc.status !== 'resolved' && (
            <Circle
              center={[inc.location.lat, inc.location.lng]}
              radius={20}
              pathOptions={{
                color: '#f85149',
                fillColor: '#f85149',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '6 4',
              }}
            />
          )}
          {/* Small red marker at the SOS location */}
          <Marker position={[inc.location.lat, inc.location.lng]} icon={dangerIcon}>
            <Popup>
              <strong>Your SOS: {inc.type.toUpperCase()}</strong><br />
              {inc.description}<br />
              <span style={{ color: inc.status === 'resolved' ? '#2ea043' : '#f85149', fontWeight: 'bold' }}>
                Status: {inc.status ? inc.status.toUpperCase() : 'PENDING'}
              </span>
            </Popup>
          </Marker>
        </React.Fragment>
      ))}

      {/* ============================================================
          Live Provider Vehicle Markers - Visible to ALL roles
          Citizens can see responders coming to help them
          ============================================================ */}
      {providers && providers.map((provider, i) => (
        provider.lat && provider.lng && (
          <Marker
            key={provider.id || i}
            position={[provider.lat, provider.lng]}
            icon={createVehicleIcon(provider.providerType)}
          >
            <Popup>
              <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                <strong>{(provider.providerType || 'UNIT').replace('_', ' ').toUpperCase()}</strong><br />
                Status: {provider.status || 'Active'}<br />
                Last seen: {provider.lastSeen ? new Date(provider.lastSeen).toLocaleTimeString() : 'Now'}
              </div>
            </Popup>
          </Marker>
        )
      ))}

      {/* Draw routing line from provider to selected incident */}
      {routingTarget && providers && providers.length > 0 && providers.map((provider, i) => (
        provider.lat && provider.lng && routingTarget.location && (
          <Polyline
            key={i}
            positions={[
              [provider.lat, provider.lng],
              [routingTarget.location.lat, routingTarget.location.lng]
            ]}
            color="#2f81f7"
            weight={3}
            dashArray="8,8"
            opacity={0.8}
          />
        )
      ))}

      {/* ============================================================
          Everything below is ONLY visible to Admin & Provider roles.
          Citizens (role === 'user') cannot see other people's
          locations, incidents, or responder positions.
          ============================================================ */}
      {!isUser && (
        <>
          {/* Incident markers + 20m danger circles (circle removed when resolved) */}
          {incidents.map((inc) => (
            <React.Fragment key={inc._id}>
              <Marker
                position={[inc.location.lat, inc.location.lng]}
                icon={dangerIcon}
                eventHandlers={{
                  click: () => {
                    if (onSelectIncident) onSelectIncident(inc);
                  },
                }}
              >
                <Popup>
                  <strong>{inc.type.toUpperCase()}</strong> ({inc.severity})<br />
                  {inc.description}<br />
                  <span style={{ color: inc.status === 'resolved' ? '#2ea043' : '#f85149', fontWeight: 'bold' }}>
                    Status: {inc.status ? inc.status.toUpperCase() : 'PENDING'}
                  </span>
                </Popup>
              </Marker>

              {/* Red circle auto-removed when incident is resolved */}
              {inc.status !== 'resolved' && (
                <Circle
                  center={[inc.location.lat, inc.location.lng]}
                  radius={20}
                  pathOptions={{
                    color: '#f85149',
                    fillColor: '#f85149',
                    fillOpacity: 0.25,
                    weight: 2,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </>
      )}

    </MapContainer>
  );
}
