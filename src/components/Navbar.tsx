import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';
import { getString } from '../constants/i18n';

interface NavbarProps {
  appLogo?: string;
  role?: UserRole;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function Navbar({ 
  appLogo, 
  role, 
  activeTab, 
  onTabChange, 
  onLogout,
  isSidebarOpen = true,
  onToggleSidebar
}: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: 'dashboard', label: getString('home') || 'Home' },
    { id: 'info', label: getString('info') || 'Info' },
    { id: 'settings', label: getString('settings') || 'Settings' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tab: string) => {
    onTabChange?.(tab);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout?.();
  };

  const isGuest = !role || role === UserRole.GUEST;

  return (
    <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center p-1.5 overflow-hidden shadow-lg shadow-indigo-200">
            <img 
              src={appLogo || "https://ui-avatars.com/api/?name=U&background=6366f1&color=ffffff"} 
              alt="Logo" 
              className="w-full h-full object-contain brightness-0 invert"
              onError={(e) => { 
                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=U&background=6366f1&color=ffffff"; 
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight text-gray-900">Cafe's Little Helper</span>
            <span className="text-indigo-500 font-medium text-xs uppercase tracking-wider">CLH</span>
          </div>
        </div>

        {!isGuest && (
          <div className="hidden md:flex items-center gap-1 px-4 py-1.5 bg-gray-50 rounded-xl">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {!isGuest ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">User</p>
                    <p className="text-xs text-gray-500 capitalize">{(role || 'user').replace('_', ' ')}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {getString('logout') || 'Logout'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
