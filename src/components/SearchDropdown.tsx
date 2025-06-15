import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiEntry } from '../types';

interface SearchDropdownProps {
  apis: ApiEntry[];
  categories: string[];
}

interface FilterState {
  category: string[];
  auth: string[];
  cors: string[];
}

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder;
    return `${selected.length} selected`;
  };

  return (
    <div className={`multi-select ${className || ''}`} ref={dropdownRef}>
      <div 
        className="multi-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="multi-select-text">{getDisplayText()}</span>
        <span className={`multi-select-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      
      {isOpen && (
        <div className="multi-select-dropdown">
          {options.map(option => (
            <div
              key={option}
              className={`multi-select-option ${selected.includes(option) ? 'selected' : ''}`}
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => {}} // Handled by onClick
                className="multi-select-checkbox"
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({ apis, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    auth: [],
    cors: []
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredApis, setFilteredApis] = useState<ApiEntry[]>([]);
  const [totalResultCount, setTotalResultCount] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique auth and cors values from APIs
  const authOptions = ['No Auth Required', ...Array.from(new Set(apis.map(api => api.Auth).filter(auth => auth))).sort()];
  const corsOptions = Array.from(new Set(apis.map(api => api.Cors).filter(cors => cors))).sort().map(cors => 
    cors === 'yes' ? 'CORS Enabled' : cors === 'no' ? 'No CORS' : cors
  );

  useEffect(() => {
    // Filter APIs based on search term and all filters
    const hasActiveFilters = filters.category.length > 0 || filters.auth.length > 0 || filters.cors.length > 0;
    
    if (searchTerm.length > 0 || hasActiveFilters) {
      const filtered = apis.filter(api => {
        const matchesSearch = searchTerm === '' || 
          api.API.toLowerCase().includes(searchTerm.toLowerCase()) ||
          api.Description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = filters.category.length === 0 || filters.category.includes(api.Category);
        
        const matchesAuth = filters.auth.length === 0 || 
          filters.auth.includes('No Auth Required') && !api.Auth ||
          filters.auth.includes(api.Auth);
        
        const matchesCors = filters.cors.length === 0 || 
          filters.cors.includes('CORS Enabled') && api.Cors === 'yes' ||
          filters.cors.includes('No CORS') && api.Cors === 'no' ||
          filters.cors.includes(api.Cors);
        
        return matchesSearch && matchesCategory && matchesAuth && matchesCors;
      });
      
      setTotalResultCount(filtered.length);
      setFilteredApis(filtered);
      setIsDropdownOpen(filtered.length > 0 && (searchTerm.length > 0 || hasActiveFilters));
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

  const handleFilterChange = (filterType: keyof FilterState, value: string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: [],
      auth: [],
      cors: []
    });
  };

  const getActiveFilterCount = () => {
    return filters.category.length + filters.auth.length + filters.cors.length;
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
            <MultiSelect
              options={categories}
              selected={filters.category}
              onChange={(selected) => handleFilterChange('category', selected)}
              placeholder="All Categories"
            />
            
            <MultiSelect
              options={authOptions}
              selected={filters.auth}
              onChange={(selected) => handleFilterChange('auth', selected)}
              placeholder="Any Auth"
            />
            
            <MultiSelect
              options={corsOptions}
              selected={filters.cors}
              onChange={(selected) => handleFilterChange('cors', selected)}
              placeholder="Any CORS"
            />

            {getActiveFilterCount() > 0 && (
              <button 
                onClick={clearAllFilters}
                className="clear-filters-btn"
                title="Clear all filters"
              >
                Clear ({getActiveFilterCount()})
              </button>
            )}
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
                  {highlightSearchTerm(
                    api.Description.length > 100 
                      ? api.Description.substring(0, 100) + '...' 
                      : api.Description, 
                    searchTerm
                  )}
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
