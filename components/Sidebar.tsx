/**
 * Sidebar Component - Navigation Sidebar
 * 
 * Toggleable sidebar with:
 * - Show/hide toggle from navbar
 * - Collapsed icon-only mode on desktop
 * - Full slide-in menu on mobile
 * - Smooth animations
 * 
 * @component
 */

import React, { useEffect, useRef } from 'react';
import { UserRole } from '../types';
import { getString } from '../src/constants/i18n';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface SidebarProps {
  appLogo: string;
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  isCollapsed?: boolean;
  onToggle: () => void;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  appLogo, 
  role, 
  activeTab, 
  onTabChange, 
  onLogout, 
  isOpen,
  isCollapsed = false,
  onToggle,
  onToggleCollapse
}) => {
  const isGuest = role === UserRole.GUEST;
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 1024) {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
          if (isOpen) onToggle();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  if (isGuest) return null;

  const menuItems = [
    { id: 'dashboard', label: getString('home') || 'Home', icon: 'home' },
    { id: 'info', label: getString('info') || 'Info', icon: 'info' },
    { id: 'settings', label: getString('settings') || 'Settings', icon: 'settings' },
  ];

  const getIcon = (iconName: string, isActive: boolean) => {
    const colorClass = isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600';
    
    switch (iconName) {
      case 'home':
        return (
          <svg className={`w-5 h-5 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'info':
        return (
          <svg className={`w-5 h-5 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className={`w-5 h-5 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />
      
      {/* Sidebar Panel - Mobile & Desktop */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 bottom-0 z-50 bg-white transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'} lg:translate-x-0 lg:bg-transparent lg:border-r lg:border-slate-200 lg:shadow-none lg:backdrop-blur-none lg:w-64`}
      >
        {/* Mobile Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <img 
                src={appLogo} 
                alt="Logo" 
                className="w-full h-full object-contain brightness-0 invert"
                onError={(e) => { 
                  (e.target as HTMLImageElement).src = getUIAvatar('U', 40); 
                }}
              />
            </div>
            <div>
              <span className="font-bold text-slate-800">Cafe's</span>
              <span className="block text-xs text-purple-600">Little Helper</span>
            </div>
          </div>
          <button onClick={onToggle} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Desktop Sidebar Content */}
        <div className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-40 pt-16">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <img 
                  src={appLogo} 
                  alt="Logo" 
                  className="w-full h-full object-contain brightness-0 invert"
                  onError={(e) => { 
                  (e.target as HTMLImageElement).src = getUIAvatar('U', 40);
                  }}
                />
              </div>
              <div>
                <span className="font-bold text-slate-800">Cafe's</span>
                <span className="block text-xs text-purple-600">Little Helper</span>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={activeTab === item.id ? 'text-white' : 'text-slate-400'}>
                  {getIcon(item.icon, activeTab === item.id)}
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Collapse/Expand Button */}
          <div className="px-4 py-4 border-t border-slate-100">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
              </svg>
              <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="lg:hidden flex flex-col h-full pt-16">
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onToggle();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={activeTab === item.id ? 'text-white' : 'text-slate-400'}>
                  {getIcon(item.icon, activeTab === item.id)}
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* User Section */}
          <div className="px-4 py-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">User</p>
                  <p className="text-xs text-slate-500 capitalize">{role.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {getString('logout') || 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
