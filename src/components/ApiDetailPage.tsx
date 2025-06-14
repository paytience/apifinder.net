import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiEntry } from '../types';
import { ApiService } from '../services/apiService';

const ApiDetailPage: React.FC = () => {
  const { apiId } = useParams<{ apiId: string }>();
  const navigate = useNavigate();
  const [api, setApi] = useState<ApiEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (apiId) {
      loadApiDetails();
    }
  }, [apiId]);

  const loadApiDetails = async () => {
    if (!apiId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Try to get API by ID first, then by slug
      let apiData: ApiEntry | null = null;
      
      if (!isNaN(Number(apiId))) {
        apiData = await ApiService.getApiById(Number(apiId));
      } else {
        apiData = await ApiService.getApiBySlug(apiId);
      }
      
      if (!apiData) {
        setError('API not found');
        return;
      }
      
      setApi(apiData);
    } catch (err) {
      console.error('Error loading API details:', err);
      setError('Failed to load API details');
    } finally {
      setLoading(false);
    }
  };

  const getAuthBadge = (auth: string) => {
    if (!auth || auth === null || auth === undefined) return <span className="badge badge-green">No Auth</span>;
    if (auth.toLowerCase().includes('key')) return <span className="badge badge-yellow">API Key</span>;
    if (auth.toLowerCase().includes('oauth')) return <span className="badge badge-blue">OAuth</span>;
    return <span className="badge badge-gray">{auth}</span>;
  };

  const getCorsStatus = (cors: string) => {
    if (!cors || cors === null || cors === undefined) return <span className="badge badge-gray">CORS Unknown</span>;
    if (cors.toLowerCase() === 'yes') return <span className="badge badge-green">CORS ✓</span>;
    if (cors.toLowerCase() === 'no') return <span className="badge badge-red">No CORS</span>;
    return <span className="badge badge-gray">CORS {cors}</span>;
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading API details...</p>
        </div>
      </div>
    );
  }

  if (error || !api) {
    return (
      <div className="app">
        <div className="error">
          <h2>⚠️ {error || 'API not found'}</h2>
          <button onClick={() => navigate('/')} className="retry-button">
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="api-detail-container">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Search
        </button>
        
        <div className="api-detail-card">
          <div className="api-detail-header">
            <h1 className="api-detail-title">{api.API}</h1>
            <span className="category-badge">{api.Category}</span>
          </div>
          
          <p className="api-detail-description">{api.Description}</p>
          
          <div className="api-detail-badges">
            {getAuthBadge(api.Auth)}
            {api.HTTPS && <span className="badge badge-green">HTTPS ✓</span>}
            {getCorsStatus(api.Cors)}
          </div>
          
          <div className="api-detail-actions">
            <a 
              href={api.Link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="api-detail-link"
            >
              Visit API Documentation →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDetailPage;
