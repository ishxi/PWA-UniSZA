import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getString } from '../src/constants/i18n';

/**
 * SearchBar Component
 * 
 * A comprehensive search component with:
 * - Real-time search with suggestions
 * - Recent searches history
 * - Filter dropdown (toggled by filter icon)
 * - Keyboard navigation support
 * 
 * @component
 * @param {Function} onSearch - Callback when search is submitted
 * @param {Function} onFilterChange - Callback when filters change
 * @param {string} placeholder - Search input placeholder text
 * @param {string[]} suggestions - Auto-suggestions array
 * @param {boolean} showFilters - Whether to show filter functionality
 * @param {string} className - Additional CSS classes
 * @param {string[]} recentSearches - Array of recent search terms
 * @param {Function} onSaveRecentSearch - Callback to save a search to history
 */

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  placeholder?: string;
  suggestions?: string[];
  showFilters?: boolean;
  className?: string;
  recentSearches?: string[];
  onSaveRecentSearch?: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilterChange, 
  placeholder,
  suggestions = [],
  showFilters = false,
  className = '',
  recentSearches = [],
  onSaveRecentSearch
}) => {
  // State management for search functionality
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    location: 'all',
    jobType: 'all',
    salaryRange: 'all'
  });
  
  // Refs for click-outside detection and focus management
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced suggestions with recent searches
  const allSuggestions = useMemo(() => {
    const combined = [...new Set([...recentSearches.slice(0, 3), ...suggestions])];
    return combined.filter(Boolean);
  }, [recentSearches, suggestions]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowRecentSearches(false);
    } else {
      setFilteredSuggestions([]);
      setShowRecentSearches(recentSearches.length > 0);
    }
    setActiveSuggestionIndex(-1);
  }, [query, suggestions, recentSearches.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    onSearch(value);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const suggestions = showRecentSearches ? recentSearches : filteredSuggestions;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setShowRecentSearches(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSaveRecentSearch?.(query.trim());
      onSearch(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setShowRecentSearches(false);
    setActiveSuggestionIndex(-1);
    onSaveRecentSearch?.(suggestion);
    onSearch(suggestion);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    setShowRecentSearches(false);
    setActiveSuggestionIndex(-1);
    onSearch('');
    inputRef.current?.focus();
  };

  const removeRecentSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // This would be handled by parent component
    console.log('Remove recent search:', searchToRemove);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative flex items-center bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-lg overflow-hidden group">
        <div className="flex items-center px-4 md:px-5">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setShowSuggestions(true);
            if (query.length === 0) {
              setShowRecentSearches(recentSearches.length > 0);
            }
          }}
          placeholder={placeholder || getString('search_placeholder')}
          className="flex-1 px-0 py-3 md:py-4 bg-transparent outline-none font-medium text-sm md:text-base placeholder:text-gray-300 focus:placeholder:text-gray-400 transition-all"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="px-3 md:px-4 text-gray-300 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Filter Toggle Button - Opens Advanced Filters */}
        {showFilters && (
          <button
            onClick={() => {
              setShowAdvancedFilters(!showAdvancedFilters);
              // Close suggestions when opening filters
              if (!showAdvancedFilters) {
                setShowSuggestions(false);
                setShowRecentSearches(false);
              }
            }}
            className={`px-3 md:px-4 transition-colors border-l border-gray-200 ${
              showAdvancedFilters 
                ? 'text-indigo-600 bg-indigo-50' 
                : 'text-gray-400 hover:text-indigo-600'
            }`}
            title={getString('filters') || 'Filters'}
          >
            <svg 
              className={`w-5 h-5 transition-transform ${showAdvancedFilters ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        )}
      </div>

      {/* Recent Searches */}
      {showRecentSearches && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-purple-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 md:px-6 py-2 md:py-3 border-b border-gray-200">
            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {getString('recent_searches') || 'Recent Searches'}
            </p>
          </div>
          {recentSearches.slice(0, 5).map((search, index) => (
            <button
              key={`recent-${index}`}
              onClick={() => handleSuggestionClick(search)}
              className={`w-full px-4 md:px-6 py-3 md:py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group ${
                activeSuggestionIndex === index ? 'bg-gray-50' : ''
              }`}
            >
               <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
              <span className="text-sm md:text-base font-medium text-gray-700 flex-1 text-left">{search}</span>
              <button
                onClick={(e) => removeRecentSearch(search, e)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </button>
          ))}
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 md:px-6 py-3 md:py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group ${
                activeSuggestionIndex === index ? 'bg-gray-50' : ''
              }`}
            >
              <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm md:text-base font-medium text-gray-700">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Filter Dropdown - Only shows when filter icon is clicked */}
      {showFilters && showAdvancedFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-4 md:p-6">
          {/* Filter Header with Title and Clear Button */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {getString('advanced_filters') || 'Advanced Filters'}
            </h4>
            <button
              onClick={() => {
                setFilters({
                  role: 'all',
                  status: 'all',
                  location: 'all',
                  jobType: 'all',
                  salaryRange: 'all'
                });
                onFilterChange?.({
                  role: 'all',
                  status: 'all',
                  location: 'all',
                  jobType: 'all',
                  salaryRange: 'all'
                });
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {getString('clear_all') || 'Clear All'}
            </button>
          </div>
          
          {/* Filter Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Job Type Filter */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                {getString('job_type') || 'Job Type'}
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 outline-none font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Types</option>
                <option value="part-time">Part Time</option>
                <option value="full-time">Full Time</option>
                <option value="internship">Internship</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            
            {/* Location Filter */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                {getString('location') || 'Location'}
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 outline-none font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Locations</option>
                <option value="campus">On Campus</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="kuala-terengganu">Kuala Terengganu</option>
              </select>
            </div>
            
            {/* Salary Range Filter */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                {getString('salary_range') || 'Salary Range'}
              </label>
              <select
                value={filters.salaryRange}
                onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 outline-none font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Salaries</option>
                <option value="0-10">RM 0-10/hour</option>
                <option value="10-20">RM 10-20/hour</option>
                <option value="20-30">RM 20-30/hour</option>
                <option value="30+">RM 30+/hour</option>
              </select>
            </div>
            
            {/* Work Schedule Filter */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                {getString('work_schedule') || 'Schedule'}
              </label>
              <select
                value={filters.schedule}
                onChange={(e) => handleFilterChange('schedule', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 outline-none font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Schedules</option>
                <option value="weekdays">Weekdays Only</option>
                <option value="weekends">Weekends Only</option>
                <option value="flexible">Flexible</option>
                <option value="evenings">Evenings</option>
              </select>
            </div>
            
            {/* Experience Level Filter */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                {getString('experience_level') || 'Experience Level'}
              </label>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 outline-none font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Levels</option>
                <option value="no-experience">No Experience</option>
                <option value="some-experience">Some Experience</option>
                <option value="experienced">Experienced</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                {getString('status') || 'Status'}
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 outline-none font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          {/* Apply Filters Button */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => {
                // Filters are automatically applied via onFilterChange callback
                setShowAdvancedFilters(false);
                inputRef.current?.focus();
              }}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              {getString('apply_filters') || 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;