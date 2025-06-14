import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiEntry } from '../types';

interface SearchDropdownProps {
  apis: ApiEntry[];
  categories: string[];
}

interface FilterState {
  category: string;
  auth: string;
  cors: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ apis, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    auth: '',
    cors: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredApis, setFilteredApis] = useState<ApiEntry[]>([]);
  const [totalResultCount, setTotalResultCount] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique auth and cors values from APIs
  const authOptions = Array.from(new Set(apis.map(api => api.Auth).filter(auth => auth))).sort();
  const corsOptions = Array.from(new Set(apis.map(api => api.Cors).filter(cors => cors))).sort();

  useEffect(() => {
    // Filter APIs based on search term and all filters
    if (searchTerm.length > 0 || filters.category || filters.auth || filters.cors) {
      const filtered = apis.filter(api => {
        const matchesSearch = searchTerm === '' || 
          api.API.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.Description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = filters.category === '' || api.Category === filters.category;
        const matchesAuth = filters.auth === '' || filters.auth === 'no-auth' || api.Auth === filters.auth;
        const matchesCors = filters.cors === '' || api.Cors === filters.cors;
        
        return matchesSearch && matchesCategory && matchesAuth && matchesCors;
      });
      
      setTotalResultCount(filtered.length);
      setFilteredApis(filtered);
      setIsDropdownOpen(filtered.length > 0 && (searchTerm.length > 0 || filters.category !== '' || filters.auth !== '' || filters.cors !== ''));
    } else {
      setTotalResultCount(0);
      setFilteredApis([]);
      setIsDropdownOpen(false);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, filters, apis]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      auth: '',
      cors: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const createApiSlug = (apiName: string) => {
    return apiName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleApiSelect = (api: ApiEntry) => {
    const slug = createApiSlug(api.API);
    navigate(`/api/${slug}`);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredApis.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredApis.length) {
          handleApiSelect(filteredApis[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    );
  };

  return (
    <div className="search-dropdown-container" ref={dropdownRef}>
      <div className="search-controls">
        <div className="search-container">
          <div className="inline-filters">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="inline-filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
            <select
              value={filters.auth}
              onChange={(e) => handleFilterChange('auth', e.target.value)}
              className="inline-filter-select"
            >
              <option value="">Any Auth</option>
              <option value="no-auth">No Auth Required</option>
              {authOptions.map(auth => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
            </select>
            
            <select
              value={filters.cors}
              onChange={(e) => handleFilterChange('cors', e.target.value)}
              className="inline-filter-select"
            >
              <option value="">Any CORS</option>
              {corsOptions.map(cors => (
                <option key={cors} value={cors}>
                  {cors === 'yes' ? 'CORS Enabled' : cors === 'no' ? 'No CORS' : cors}
                </option>
              ))}
            </select>
          </div>
          
          <div className="search-input-container">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search APIs by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="search-dropdown">
          <div className="dropdown-header">
            <span>{totalResultCount} API{totalResultCount !== 1 ? 's' : ''} found</span>
            {totalResultCount > 40 && <span className="more-results">Showing first 40 results</span>}
          </div>
          
          <div className="dropdown-results">
            {filteredApis.slice(0, 40).map((api, index) => (
              <div
                key={`${api.API}-${api.Category}`}
                className={`dropdown-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleApiSelect(api)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="dropdown-item-main">
                  <h4 className="dropdown-item-title">
                    {highlightSearchTerm(api.API, searchTerm)}
                  </h4>
                  <span className="dropdown-item-category">{api.Category}</span>
                </div>
                <p className="dropdown-item-description">
                  {highlightSearchTerm(api.Description, searchTerm)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
