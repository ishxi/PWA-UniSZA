import React from 'react';
import { User, UserRole } from '../types';
import { getString } from '../src/constants/i18n';

interface BottomNavProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ user, activeTab, onTabChange, unreadCount = 0 }) => {
  const isStudent = user.role === UserRole.JOB_SEEKER;
  const isEmployer = user.role === UserRole.EMPLOYER;

  const studentNavItems = [
    { id: 'home', label: getString('home'), icon: '🏠' },
    { id: 'jobs', label: getString('jobs'), icon: '🔍' },
    { id: 'applications', label: getString('applications'), icon: '📋' },
    { id: 'profile', label: getString('profile'), icon: '👤' },
  ];

  const employerNavItems = [
    { id: 'dashboard', label: getString('home'), icon: '🏠' },
    { id: 'jobs', label: getString('jobs'), icon: '📋' },
    { id: 'profile', label: getString('profile'), icon: '👤' },
  ];

  const navItems = isStudent ? studentNavItems : isEmployer ? employerNavItems : studentNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 safe-area-bottom">
      <div className="flex items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 relative ${
                isActive ? 'text-purple-600' : 'text-slate-400'
              }`}
            >
              <div className={`flex items-center justify-center w-11 h-8 rounded-xl transition-all ${
                isActive ? 'bg-purple-100' : ''
              }`}>
                <span className="text-[22px]">{item.icon}</span>
                {item.id === 'applicants' && unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-purple-600' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
