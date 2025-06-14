import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ApiEntry } from './types';
import { ApiService } from './services/apiService';
import SearchDropdown from './components/SearchDropdown';
import ApiDetailPage from './components/ApiDetailPage';
import Header from './components/Header';

function HomePage() {
  const [apis, setApis] = useState<ApiEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all APIs and categories from Supabase
      const [apisData, categoriesData] = await Promise.all([
        ApiService.getAllApis(),
        ApiService.getCategories()
      ]);
      
      setApis(apisData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load APIs. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading APIs from Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={loadInitialData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Header apiCount={apis.length} categoryCount={categories.length} />
      <main className="main-content">
        <SearchDropdown apis={apis} categories={categories} />
        <div className="search-info">
          <p>Search through {apis.length} APIs from {categories.length} categories</p>
          <p className="search-hint">💡 Start typing to see search results, or select a category to browse</p>
        </div>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/api/:apiId" element={<ApiDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
