import React, { useState, useMemo, useCallback } from 'react';
import { JobPost, JobStatus, JobGenderType } from '../../types';

interface AdvancedSearchProps {
  jobs: JobPost[];
  onSearch: (filteredJobs: JobPost[]) => void;
  onFiltersChange: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  location: string;
  jobType: string;
  salaryRange: {
    min: number;
    max: number;
  };
  preferredGender: JobGenderType | '';
  datePosted: 'any' | 'today' | 'week' | 'month';
  sortBy: 'relevance' | 'date' | 'salary' | 'location';
  sortOrder: 'asc' | 'desc';
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ jobs, onSearch, onFiltersChange }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    jobType: '',
    salaryRange: { min: 0, max: 10000 },
    preferredGender: '',
    datePosted: 'any',
    sortBy: 'relevance',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Generate search suggestions based on job titles, companies, and locations
  const generateSuggestions = useCallback((query: string) => {
    if (!query) return [];

    const suggestions = new Set<string>();
    const lowerQuery = query.toLowerCase();

    jobs.forEach(job => {
      // Title suggestions
      if (job.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.title);
      }
      
      // Company suggestions
      if (job.employerName?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.employerName);
      }
      
      // Location suggestions
      if (job.location?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.location);
      }
      
      // Extract keywords from description
      const words = job.description.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.includes(lowerQuery) && word.length > 2) {
          suggestions.add(word);
        }
      });
    });

    return Array.from(suggestions).slice(0, 8);
  }, [jobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => {
      // Text search
      const matchesQuery = !filters.query || 
        job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.employerName?.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.location?.toLowerCase().includes(filters.query.toLowerCase());

      // Location filter
      const matchesLocation = !filters.location || 
        job.location?.toLowerCase().includes(filters.location.toLowerCase());

      // Job type filter
      const matchesJobType = !filters.jobType || 
        job.title.toLowerCase().includes(filters.jobType.toLowerCase());

      // Salary range filter
      const salaryMatch = job.paymentInfo ? 
        parseInt(job.paymentInfo.replace(/[^0-9]/g, '')) >= filters.salaryRange.min &&
        parseInt(job.paymentInfo.replace(/[^0-9]/g, '')) <= filters.salaryRange.max : true;

      // Gender filter - OPEN accepts all, otherwise match specific gender
      const matchesGender = !filters.preferredGender || 
        filters.preferredGender === '' ||
        job.preferredGender === undefined ||
        job.preferredGender === 'OPEN' ||
        job.preferredGender === filters.preferredGender;

      // Date filter
      let matchesDate = true;
      if (filters.datePosted !== 'any' && job.createdAt) {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        
        switch (filters.datePosted) {
          case 'today':
            matchesDate = jobDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = jobDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = jobDate >= monthAgo;
            break;
        }
      }

      return matchesQuery && matchesLocation && matchesJobType && salaryMatch && matchesGender && matchesDate;
    });

    // Sort results
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
        case 'salary':
          const salaryA = parseInt(a.paymentInfo?.replace(/[^0-9]/g, '') || '0');
          const salaryB = parseInt(b.paymentInfo?.replace(/[^0-9]/g, '') || '0');
          comparison = salaryA - salaryB;
          break;
        case 'location':
          comparison = (a.location || '').localeCompare(b.location || '');
          break;
        case 'relevance':
        default:
          // Simple relevance: prioritize exact title matches
          const aMatches = a.title.toLowerCase().includes(filters.query.toLowerCase()) ? 1 : 0;
          const bMatches = b.title.toLowerCase().includes(filters.query.toLowerCase()) ? 1 : 0;
          comparison = bMatches - aMatches;
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [jobs, filters]);

  // Update search when filters change
  React.useEffect(() => {
    onSearch(filteredJobs);
    onFiltersChange(filters);
  }, [filteredJobs, onSearch, onFiltersChange]);

  // Handle query change with suggestions
  const handleQueryChange = (value: string) => {
    setFilters(prev => ({ ...prev, query: value }));
    setSearchSuggestions(generateSuggestions(value));
  };

  // Apply filter
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      jobType: '',
      salaryRange: { min: 0, max: 10000 },
      preferredGender: '',
      datePosted: 'any',
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
    setSearchSuggestions([]);
  };

  // Popular job categories
  const jobCategories = ['kitchen', 'laboratory', 'sports', 'canteen', 'stall', 'library', 'office', 'maintenance'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={filters.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setSearchSuggestions(generateSuggestions(filters.query))}
          onBlur={() => setTimeout(() => setSearchSuggestions([]), 200)}
          placeholder="Search jobs by title, company, location, or keywords..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        {/* Search Suggestions */}
        {searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQueryChange(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 py-1">Quick filters:</span>
        {jobCategories.map(category => (
          <button
            key={category}
            onClick={() => handleQueryChange(category)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {showFilters ? 'Hide' : 'Show'} Advanced Filters
      </button>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              placeholder="City or campus area"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <select
              value={filters.jobType}
              onChange={(e) => updateFilter('jobType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="kitchen">Kitchen Helper</option>
              <option value="laboratory">Lab Assistant</option>
              <option value="sports">Sports Assistant</option>
              <option value="canteen">Canteen Staff</option>
              <option value="stall">Stall Helper</option>
              <option value="library">Library Assistant</option>
              <option value="office">Office Assistant</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range: RM{filters.salaryRange.min} - RM{filters.salaryRange.max}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.salaryRange.min}
                onChange={(e) => updateFilter('salaryRange', { ...filters.salaryRange, min: parseInt(e.target.value) || 0 })}
                placeholder="Min"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <input
                type="number"
                value={filters.salaryRange.max}
                onChange={(e) => updateFilter('salaryRange', { ...filters.salaryRange, max: parseInt(e.target.value) || 10000 })}
                placeholder="Max"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Date Posted */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Posted</label>
            <select
              value={filters.datePosted}
              onChange={(e) => updateFilter('datePosted', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="any">Any Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date Posted</option>
              <option value="salary">Salary</option>
              <option value="location">Location</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => updateFilter('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      )}

      {/* Filter Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Found {filteredJobs.length} jobs
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearch;