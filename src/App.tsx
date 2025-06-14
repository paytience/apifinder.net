import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { ApiEntry } from './types';
import { ApiService } from './services/apiService';
import SearchBar from './components/SearchBar';
import ApiList from './components/ApiList';
import Header from './components/Header';

function App() {
  const [apis, setApis] = useState<ApiEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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
      
      // Load APIs and categories from Supabase
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

  const filteredApis = useMemo(() => {
    return apis.filter(api => {
      const matchesSearch = searchTerm === '' || 
        api.API.toLowerCase().includes(searchTerm.toLowerCase()) ||
        api.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        api.Category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || api.Category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [apis, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading APIs from Supabase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={loadInitialData} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
        <div className="results-info">
          <p>Found {filteredApis.length} APIs {searchTerm && `for "${searchTerm}"`}</p>
        </div>
        <ApiList apis={filteredApis} />
      </main>
    </div>
  );
}

export default App;
