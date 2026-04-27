import React from 'react';
import { CheckCircle, Clock, Truck, AlertCircle, MapPin } from 'lucide-react';

export default function IncidentStatusTracker({ myIncidents, activeProviders }) {
  if (!myIncidents || myIncidents.length === 0) return null;

  const getStatusStep = (status) => {
    if (status === 'resolved') return 3;
    if (status === 'in-progress') return 2;
    return 1;
  };

  const steps = [
    { label: 'SOS Received', icon: <AlertCircle size={16} /> },
    { label: 'Responder Dispatched', icon: <Truck size={16} /> },
    { label: 'Resolved', icon: <CheckCircle size={16} /> }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '320px',
      background: 'rgba(13, 17, 23, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px',
      padding: '1.5rem',
      zIndex: 9999,
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
    }}>
      <div style={{ fontSize: '0.7rem', color: '#2f81f7', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '1rem' }}>
        📡 YOUR SOS STATUS
      </div>

      {myIncidents.slice(0, 2).map((incident, idx) => {
        const step = getStatusStep(incident.status);
        // Find nearest provider
        const nearest = activeProviders && activeProviders.length > 0 ? activeProviders[0] : null;

        return (
          <div key={incident._id || idx} style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff' }}>
                {(incident.type || 'incident').toUpperCase()}
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '10px',
                background: incident.status === 'resolved' ? 'rgba(63,185,80,0.15)' : incident.status === 'in-progress' ? 'rgba(47,129,247,0.15)' : 'rgba(248,81,73,0.15)',
                color: incident.status === 'resolved' ? '#3fb950' : incident.status === 'in-progress' ? '#2f81f7' : '#f85149'
              }}>
                {(incident.status || 'pending').toUpperCase()}
              </span>
            </div>

            {/* Progress Steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.75rem' }}>
              {steps.map((s, i) => (
                <React.Fragment key={i}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: step > i ? '#2f81f7' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${step > i ? '#2f81f7' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step > i ? '#fff' : '#484f58',
                    flexShrink: 0
                  }}>
                    {s.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: '2px',
                      background: step > i + 1 ? '#2f81f7' : 'rgba(255,255,255,0.05)'
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div style={{ fontSize: '0.7rem', color: '#8b949e' }}>
              {step === 1 && '⏳ Locating nearest responder...'}
              {step === 2 && nearest && `🚗 Responder en route • ${nearest.providerType?.replace('_', ' ') || 'Unit'} dispatched`}
              {step === 2 && !nearest && '🚗 Responder dispatched to your location'}
              {step === 3 && '✅ Incident resolved. Stay safe!'}
            </div>

            {incident.aiAnalysis && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#2f81f7' }}>
                🤖 AI: {incident.aiAnalysis.estimatedResponseTime || 'ETA calculating...'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
