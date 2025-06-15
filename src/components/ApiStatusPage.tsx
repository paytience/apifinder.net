import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  lastChecked: string;
  responseTime: number;
}

const ApiStatusPage: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API Search Service',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      responseTime: 45
    },
    {
      name: 'User Authentication',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      responseTime: 32
    },
    {
      name: 'Database',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      responseTime: 28
    },
    {
      name: 'Payment Processing',
      status: 'operational',
      lastChecked: new Date().toISOString(),
      responseTime: 156
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'outage': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'degraded': return 'Degraded Performance';
      case 'outage': return 'Service Outage';
      default: return 'Unknown';
    }
  };

  const overallStatus = services.every(s => s.status === 'operational') 
    ? 'All Systems Operational' 
    : services.some(s => s.status === 'outage')
    ? 'Service Disruption'
    : 'Degraded Performance';

  return (
    <div className="static-page">
      <div className="static-page-container">
        <div className="static-page-header">
          <h1>API Status</h1>
          <p>Real-time status of API Finder services</p>
        </div>

        <div className="static-page-content">
          <div className="status-overview">
            <div className="overall-status">
              <h2>{overallStatus}</h2>
              <p>Last updated: {new Date().toLocaleString()}</p>
            </div>
          </div>

          <div className="services-status">
            <h3>Service Status</h3>
            <div className="status-grid">
              {services.map((service, index) => (
                <div key={index} className="status-card">
                  <div className="status-header">
                    <h4>{service.name}</h4>
                    <div 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(service.status) }}
                    ></div>
                  </div>
                  <div className="status-details">
                    <p className="status-text">{getStatusText(service.status)}</p>
                    <p className="response-time">Response time: {service.responseTime}ms</p>
                    <p className="last-checked">
                      Last checked: {new Date(service.lastChecked).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="status-history">
            <h3>Recent Incidents</h3>
            <div className="incident-list">
              <div className="incident-item">
                <div className="incident-date">Jan 10, 2025</div>
                <div className="incident-description">
                  <strong>Resolved:</strong> Brief authentication service slowdown (15 minutes)
                </div>
              </div>
              <div className="incident-item">
                <div className="incident-date">Jan 5, 2025</div>
                <div className="incident-description">
                  <strong>Resolved:</strong> Scheduled maintenance completed successfully
                </div>
              </div>
              <div className="incident-item">
                <div className="incident-date">Dec 28, 2024</div>
                <div className="incident-description">
                  <strong>Resolved:</strong> Database performance optimization
                </div>
              </div>
            </div>
          </div>

          <div className="status-info">
            <h3>About This Page</h3>
            <p>
              This page shows the real-time status of all API Finder services. We monitor our 
              systems 24/7 and update this page immediately when issues are detected. 
              If you're experiencing problems not reflected here, please 
              <Link to="/contact" className="inline-link"> contact our support team</Link>.
            </p>
          </div>
        </div>

        <div className="static-page-footer">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusPage;
