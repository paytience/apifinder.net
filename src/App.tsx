import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { ApiEntry, ApiData } from './types';
import SearchBar from './components/SearchBar';
import ApiList from './components/ApiList';
import Header from './components/Header';

function App() {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load API data from the public-apis repository
    fetch('/public-apis/db/resources.json')
      .then(response => response.json())
      .then((data: ApiData) => {
        setApiData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading API data:', error);
        setLoading(false);
      });
  }, []);

  const filteredApis = useMemo(() => {
    if (!apiData) return [];
    
    return apiData.entries.filter(api => {
      const matchesSearch = searchTerm === '' || 
        api.API.toLowerCase().includes(searchTerm.toLowerCase()) ||
        api.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        api.Category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || api.Category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [apiData, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    if (!apiData) return [];
    const uniqueCategories = Array.from(new Set(apiData.entries.map(api => api.Category)));
    return uniqueCategories.sort();
  }, [apiData]);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading APIs...</p>
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
