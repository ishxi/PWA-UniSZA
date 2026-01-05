import React, { useEffect } from 'react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  label?: string;
  storageKey?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ 
  view, 
  onViewChange, 
  label = 'View',
  storageKey = 'ej_view_preference'
}) => {
  // Save view preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, view);
    } catch (e) {
      // Silently fail if localStorage is full
    }
  }, [view, storageKey]);

  const handleViewChange = (newView: 'grid' | 'list') => {
    onViewChange(newView);
  };

  return (
    <div className="flex items-center gap-2 bg-purple-50/50 rounded-full p-1 border border-purple-100">
      <span className="text-[8px] md:text-[9px] font-black text-purple-400 uppercase tracking-widest px-3 hidden sm:block">
        {label}
      </span>
      
      {/* Grid View Button */}
      <button
        onClick={() => handleViewChange('grid')}
        className={`p-2 md:p-2.5 rounded-full transition-all relative ${
          view === 'grid' 
            ? 'bg-white text-purple-600 shadow-md scale-105' 
            : 'text-purple-400 hover:text-purple-600 hover:scale-105'
        }`}
        title="Grid View"
        aria-label="Switch to grid view"
        aria-pressed={view === 'grid'}
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        {view === 'grid' && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-600 rounded-full"></span>
        )}
      </button>
      
      {/* List View Button */}
      <button
        onClick={() => handleViewChange('list')}
        className={`p-2 md:p-2.5 rounded-full transition-all relative ${
          view === 'list' 
            ? 'bg-white text-purple-600 shadow-md scale-105' 
            : 'text-purple-400 hover:text-purple-600 hover:scale-105'
        }`}
        title="List View"
        aria-label="Switch to list view"
        aria-pressed={view === 'list'}
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {view === 'list' && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-600 rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default ViewToggle;