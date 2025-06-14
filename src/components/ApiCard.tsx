import React from 'react';
import { ApiEntry } from '../types';

interface ApiCardProps {
  api: ApiEntry;
}

const ApiCard: React.FC<ApiCardProps> = ({ api }) => {
  const getAuthBadge = (auth: string) => {
    if (!auth) return <span className="badge badge-green">No Auth</span>;
    if (auth.toLowerCase().includes('key')) return <span className="badge badge-yellow">API Key</span>;
    if (auth.toLowerCase().includes('oauth')) return <span className="badge badge-blue">OAuth</span>;
    return <span className="badge badge-gray">{auth}</span>;
  };

  const getCorsStatus = (cors: string) => {
    if (cors.toLowerCase() === 'yes') return <span className="badge badge-green">CORS ✓</span>;
    if (cors.toLowerCase() === 'no') return <span className="badge badge-red">No CORS</span>;
    return <span className="badge badge-gray">CORS {cors}</span>;
  };

  return (
    <div className="api-card">
      <div className="api-card-header">
        <h3 className="api-name">{api.API}</h3>
        <span className="category-badge">{api.Category}</span>
      </div>
      
      <p className="api-description">{api.Description}</p>
      
      <div className="api-badges">
        {getAuthBadge(api.Auth)}
        {api.HTTPS && <span className="badge badge-green">HTTPS ✓</span>}
        {getCorsStatus(api.Cors)}
      </div>
      
      <div className="api-card-footer">
        <a 
          href={api.Link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="api-link"
        >
          Visit API →
        </a>
      </div>
    </div>
  );
};

export default ApiCard;
