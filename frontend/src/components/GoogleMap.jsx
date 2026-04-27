import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';
import { AlertCircle, MapPin, Clock, Phone } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 60px)',
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090, // Default to Delhi, India
};

export default function GoogleMapComponent({ 
  incidents, 
  userLocation, 
  selectedIncident, 
  onMarkerClick, 
  userRole 
}) {
  const [mapInstance, setMapInstance] = useState(null);
  const [infoWindowIncident, setInfoWindowIncident] = useState(null);

  useEffect(() => {
    if (selectedIncident && mapInstance) {
      mapInstance.panTo({
        lat: selectedIncident.location.lat,
        lng: selectedIncident.location.lng,
      });
      mapInstance.setZoom(15);
    }
  }, [selectedIncident, mapInstance]);

  const getMarkerIcon = (severity) => {
    const colors = {
      critical: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      high: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      medium: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      low: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    };
    return colors[severity] || colors.medium;
  };

  const heatmapData = incidents
    .filter(i => i.location && (i.severity === 'high' || i.severity === 'critical'))
    .map(i => {
      if (typeof google !== 'undefined') {
        return {
          location: new google.maps.LatLng(i.location.lat, i.location.lng),
          weight: i.severity === 'critical' ? 1 : 0.7,
        };
      }
      return null;
    })
    .filter(Boolean);

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
    gestureHandling: 'auto',
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#f85149',
      high: '#fb8500',
      medium: '#fbbf24',
      low: '#3b82f6',
    };
    return colors[severity] || '#3b82f6';
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCenter}
          zoom={13}
          onLoad={setMapInstance}
          options={mapOptions}
        >
          {/* Heatmap Layer for High Severity Incidents */}
          {userRole === 'admin' && heatmapData.length > 0 && (
            <HeatmapLayer 
              data={heatmapData} 
              options={{ 
                radius: 25, 
                opacity: 0.7,
                gradient: [
                  'rgba(0, 255, 0, 0)',
                  'rgba(255, 255, 0, 1)',
                  'rgba(255, 128, 0, 1)',
                  'rgba(255, 0, 0, 1)'
                ]
              }} 
            />
          )}

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
          )}

          {/* Incident Markers */}
          {incidents.map((incident) => (
            incident.location && (
              <Marker
                key={incident.id}
                position={{
                  lat: incident.location.lat,
                  lng: incident.location.lng,
                }}
                title={incident.type}
                icon={getMarkerIcon(incident.severity)}
                onClick={() => {
                  onMarkerClick && onMarkerClick(incident);
                  setInfoWindowIncident(incident);
                }}
              >
                {infoWindowIncident?.id === incident.id && (
                  <InfoWindow 
                    onCloseClick={() => setInfoWindowIncident(null)}
                    options={{
                      pixelOffset: new google.maps.Size(0, -40)
                    }}
                  >
                    <div style={{ 
                      padding: '12px', 
                      minWidth: '280px',
                      backgroundColor: '#0d1117',
                      color: '#e6edf3',
                      borderRadius: '8px',
                      border: `2px solid ${getSeverityColor(incident.severity)}`
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <h4 style={{ 
                          margin: '0 0 4px 0', 
                          color: getSeverityColor(incident.severity),
                          fontSize: '16px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <AlertCircle size={18} />
                          {incident.type.toUpperCase()}
                        </h4>
                      </div>
                      
                      <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                        <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#79c0ff' }}>Severity:</span>
                          <span style={{ 
                            color: getSeverityColor(incident.severity),
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}>
                            {incident.severity}
                          </span>
                        </p>
                        
                        <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#79c0ff' }}>Status:</span>
                          {incident.status}
                        </p>

                        {incident.contactNumber && (
                          <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={14} />
                            {incident.contactNumber}
                          </p>
                        )}

                        <p style={{ margin: '4px 0', color: '#8b949e', fontSize: '11px' }}>
                          {new Date(incident.createdAt?.toDate?.() || incident.createdAt).toLocaleString()}
                        </p>

                        <p style={{ margin: '8px 0 0 0', color: '#e6edf3', fontSize: '11px' }}>
                          {incident.description}
                        </p>

                        {incident.aiAnalysis && (
                          <div style={{ 
                            marginTop: '8px', 
                            paddingTop: '8px', 
                            borderTop: '1px solid #30363d',
                            color: '#79c0ff',
                            fontSize: '10px'
                          }}>
                            <strong>AI Analysis:</strong> {(incident.aiAnalysis.confidence * 100).toFixed(0)}% confidence
                          </div>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            )
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
