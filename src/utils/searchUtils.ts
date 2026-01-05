// Enhanced search and view management utilities
export interface SearchHistory {
  query: string;
  timestamp: string;
  resultCount?: number;
}

export interface ViewPreferences {
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
  showFilters: boolean;
  compactMode: boolean;
}

const SEARCH_HISTORY_KEY = 'ej_search_history';
const VIEW_PREFERENCES_KEY = 'ej_view_preferences';
const MAX_SEARCH_HISTORY = 20;

// Search History Management
export const saveSearchHistory = (query: string, resultCount?: number): void => {
  try {
    const existing = getSearchHistory();
    const newEntry: SearchHistory = {
      query: query.trim(),
      timestamp: new Date().toISOString(),
      resultCount
    };

    // Remove existing entry with same query
    const filtered = existing.filter(item => item.query !== query.trim());
    
    // Add new entry at the beginning
    const updated = [newEntry, ...filtered].slice(0, MAX_SEARCH_HISTORY);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    // Silently fail if localStorage is full
  }
};

export const getSearchHistory = (): SearchHistory[] => {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const getRecentSearches = (limit: number = 5): string[] => {
  return getSearchHistory()
    .slice(0, limit)
    .map(item => item.query);
};

export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (e) {
    // Silently fail
  }
};

export const removeFromSearchHistory = (queryToRemove: string): void => {
  try {
    const existing = getSearchHistory();
    const filtered = existing.filter(item => item.query !== queryToRemove);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    // Silently fail
  }
};

// View Preferences Management
export const getViewPreferences = (): ViewPreferences => {
  try {
    const stored = localStorage.getItem(VIEW_PREFERENCES_KEY);
    const defaults: ViewPreferences = {
      defaultView: 'grid',
      itemsPerPage: 12,
      showFilters: true,
      compactMode: false
    };
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  } catch (e) {
    return {
      defaultView: 'grid',
      itemsPerPage: 12,
      showFilters: true,
      compactMode: false
    };
  }
};

export const saveViewPreferences = (preferences: Partial<ViewPreferences>): void => {
  try {
    const existing = getViewPreferences();
    const updated = { ...existing, ...preferences };
    localStorage.setItem(VIEW_PREFERENCES_KEY, JSON.stringify(updated));
  } catch (e) {
    // Silently fail
  }
};

// Enhanced search suggestions
export const generateSearchSuggestions = (
  query: string,
  items: any[],
  searchFields: string[],
  history: SearchHistory[]
): string[] => {
  const suggestions = new Set<string>();

  // Add recent searches that match
  history
    .filter(item => item.query.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3)
    .forEach(item => suggestions.add(item.query));

  // Add suggestions from items
  items.forEach(item => {
    searchFields.forEach(field => {
      const value = item[field];
      if (value && typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        if (lowerValue.includes(query.toLowerCase()) && value.trim()) {
          suggestions.add(value.trim());
        }
      }
    });
  });

  return Array.from(suggestions).slice(0, 10);
};

// Debounced search with history
export const debouncedSearchWithHistory = (
  searchFn: (query: string) => void,
  delay: number = 300
) => {
  let timeoutId: number;
  
  return (query: string, resultCount?: number) => {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      searchFn(query);
      if (query.trim()) {
        saveSearchHistory(query, resultCount);
      }
    }, delay);
  };
};

// Filter utilities
export const createAdvancedFilter = (filters: Record<string, any>) => {
  return (item: any) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      
      switch (key) {
        case 'jobType':
          return item.jobType === value;
        case 'location':
          const locationValue = String(value).toLowerCase();
          return (item.location && typeof item.location === 'string' && item.location.toLowerCase().includes(locationValue)) || 
                 (item.employerLocation && typeof item.employerLocation === 'string' && item.employerLocation.toLowerCase().includes(locationValue));
        case 'salaryRange':
          if (value === '30+') return (item.hourlyRate || 0) >= 30;
          const salaryValue = String(value);
          const [min, max] = salaryValue.split('-').map(Number);
          return (item.hourlyRate || 0) >= min && (item.hourlyRate || 0) <= max;
        case 'schedule':
          return item.schedule === value;
        case 'experience':
          return item.experienceLevel === value;
        default:
          return true;
      }
    });
  };
};

// Sort utilities
export const sortJobs = (jobs: any[], sortBy: string, direction: 'asc' | 'desc' = 'desc') => {
  return [...jobs].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'salary':
        comparison = (a.hourlyRate || 0) - (b.hourlyRate || 0);
        break;
      case 'date':
        comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        break;
      case 'location':
        comparison = (a.location || '').localeCompare(b.location || '');
        break;
      default:
        comparison = 0;
    }
    
    return direction === 'desc' ? -comparison : comparison;
  });
};