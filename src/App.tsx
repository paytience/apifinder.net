import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchDropdown from './components/SearchDropdown';
import ApiDetailPage from './components/ApiDetailPage';
import RegisterPage from './components/RegisterPage';
import EmailRegisterPage from './components/EmailRegisterPage';
import LoginPage from './components/LoginPage';
import SubscribePage from './components/SubscribePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import CookiePage from './components/CookiePage';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import { ApiEntry } from './types';
import { ApiService } from './services/apiService';
import './App.css';

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
        <div className="hero-section">
          <h1 className="hero-title">Discover the Perfect APIs</h1>
          <p className="hero-subtitle">Find and explore hundreds of free APIs to power your next project</p>
        </div>
        <div className="search-section">
          <SearchDropdown 
            apis={apis} 
            categories={categories}
          />
          <p>Search through {apis.length} APIs from {categories.length} categories</p>
          <p className="search-hint">💡 Start typing to see search results, or select a category to browse</p>
        </div>
        <Pricing />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-email" element={<EmailRegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiePage />} />
          <Route path="/api/:apiId" element={<ApiDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
