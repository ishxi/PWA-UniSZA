/**
 * UserProfileDetail Component
 * 
 * Displays a detailed modal view of a user's profile with tabbed navigation.
 * Features:
 * - Tab-based navigation (Basic, Academic, Professional, Contact)
 * - Scrollable content area that properly fills the modal
 * - Responsive design for all screen sizes
 * 
 * @component
 * @param {User} user - The user object to display
 * @param {() => void} onClose - Callback when modal is closed
 * @param {() => void} onEdit - Optional callback for edit action
 */

import React, { useState } from 'react';
import { User, Gender, AvailabilityStatus, UserRole } from '../types';
import { getString } from '../src/constants/i18n';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface UserProfileDetailProps {
  user: User;
  onClose: () => void;
  onEdit?: () => void;
}

const UserProfileDetail: React.FC<UserProfileDetailProps> = ({ user, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'academic' | 'professional' | 'contact'>('basic');

  const tabs = [
    { id: 'basic', label: getString('basics') || 'Basics', icon: '👤' },
    { id: 'academic', label: getString('academic') || 'Academic', icon: '🎓' },
    { id: 'professional', label: getString('professional') || 'Professional', icon: '💼' },
    { id: 'contact', label: getString('contact') || 'Contact', icon: '📱' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-5">
            {/* Avatar and Quick Info Row */}
            <div className="flex items-center gap-5">
              <img 
                src={getUIAvatar(`${user.firstName} ${user.lastName}`, 128)}
                className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-md"
                alt="Profile"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-slate-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-purple-600 font-medium">@{user.username}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
                    {user.role}
                  </span>
                  {user.profile?.status === AvailabilityStatus.AVAILABLE && (
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
                      Available
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50/50 p-4 rounded-xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Username</p>
                <p className="font-medium text-slate-800">@{user.username}</p>
              </div>
              <div className="bg-purple-50/50 p-4 rounded-xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Account Type</p>
                <p className="font-medium text-slate-800">{user.role}</p>
              </div>
            </div>

            {/* Bio Section */}
            {user.profile?.bio && (
              <div className="bg-purple-50/50 p-4 rounded-xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Bio</p>
                <p className="text-sm text-slate-700 leading-relaxed">{user.profile.bio}</p>
              </div>
            )}
          </div>
        );

      case 'academic':
        return (
          <div className="space-y-5">
            {user.profile ? (
              <>
                {/* Academic Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50/50 p-4 rounded-xl">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Major/Field</p>
                    <p className="font-medium text-slate-800">{user.profile.major || 'Not specified'}</p>
                  </div>
                  <div className="bg-purple-50/50 p-4 rounded-xl">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Year</p>
                    <p className="font-medium text-slate-800">Year {user.profile.year || 'Not specified'}</p>
                  </div>
                </div>

                {/* Skills Section */}
                {user.profile.skills && user.profile.skills.length > 0 && (
                  <div className="bg-purple-50/50 p-4 rounded-xl">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user.profile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 bg-white text-purple-600 rounded-lg text-xs font-medium border border-purple-100">
                          ✨ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience Section */}
                {user.profile.experience && (
                  <div className="bg-purple-50/50 p-4 rounded-xl">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Experience</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{user.profile.experience}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-purple-50/50 p-6 rounded-xl text-center">
                <p className="text-slate-500">No academic information available</p>
              </div>
            )}
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-5">
            {/* Rating Section */}
            {user.profile?.averageRating && (
              <div className="bg-purple-50/50 p-4 rounded-xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Average Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-purple-600">⭐ {user.profile.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-slate-500">/ 5.0</span>
                </div>
              </div>
            )}

            {/* Company Info Section */}
            {user.employerProfile && (
              <div className="bg-purple-50/50 p-4 rounded-xl">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Company Information</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-slate-800">{user.employerProfile.companyName}</p>
                  </div>
                  {user.employerProfile.businessType && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Business Type</p>
                      <p className="text-sm text-slate-700">{user.employerProfile.businessType}</p>
                    </div>
                  )}
                  {user.employerProfile.bio && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Company Bio</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{user.employerProfile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Data Fallback */}
            {!user.profile?.averageRating && !user.employerProfile && (
              <div className="bg-purple-50/50 p-6 rounded-xl text-center">
                <p className="text-slate-500">No professional information available</p>
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-5">
            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {user.phoneNumber && (
                <div className="bg-purple-50/50 p-4 rounded-xl">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-medium text-slate-800">{user.phoneNumber}</p>
                </div>
              )}
              
              {user.email && (
                <div className="bg-purple-50/50 p-4 rounded-xl">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-slate-800">{user.email}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {user.phoneNumber && (
                <button 
                  onClick={() => window.open(`https://wa.me/${user.phoneNumber}`, '_blank')}
                  className="flex-1 bg-green-500 text-white px-5 py-3 rounded-xl font-medium text-sm shadow-lg shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <span>📱</span> WhatsApp
                </button>
              )}
              
              {user.email && (
                <button className="flex-1 bg-blue-500 text-white px-5 py-3 rounded-xl font-medium text-sm shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  <span>✉️</span> Email
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-purple-950/40 backdrop-blur-md z-[500] flex items-center justify-center p-4">
      {/* Modal Container - Fixed height with proper overflow handling */}
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] relative shadow-xl flex flex-col overflow-hidden">
        
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl hover:bg-rose-50 hover:text-rose-500 transition-all"
        >
          ×
        </button>
        
        {/* Header Section with Gradient Background */}
        <div className="p-6 md:p-8 border-b border-purple-100 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-purple-50 to-white relative">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
            <span className="text-8xl">🎓</span>
          </div>
          
          {/* User Avatar */}
          <img 
            src={getUIAvatar(`${user.firstName} ${user.lastName}`, 128)}
            className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg ring-4 ring-white relative z-10"
            alt={`${user.firstName} ${user.lastName}`}
          />
          
          {/* User Info */}
          <div className="text-center md:text-left relative z-10 flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {user.firstName} {user.lastName}
            </h2>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                Candidate
              </span>
              <span className="px-4 py-1.5 bg-white text-purple-600 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm border border-purple-100">
                @{user.username}
              </span>
              {user.profile?.status === AvailabilityStatus.AVAILABLE && (
                <span className="px-4 py-1.5 bg-green-500 text-white rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                  Active Now
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Tab Navigation - Sticky at top */}
        <div className="px-4 md:px-6 py-3 bg-white border-b border-purple-100 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Scrollable Content Area - Grows to fill available space */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-white">
          <div className="animate-in fade-in duration-300 space-y-5">
            {renderTabContent()}
          </div>
        </div>
        
        {/* Footer Action Bar - Fixed at bottom */}
        <div className="p-4 bg-slate-50 border-t border-purple-100 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white text-slate-500 rounded-xl font-medium text-sm border border-slate-200 hover:bg-slate-100 transition-all"
          >
            {getString('close') || 'Close'}
          </button>
          {user.phoneNumber && (
            <button 
              onClick={() => window.open(`https://wa.me/${user.phoneNumber}`, '_blank')}
              className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-green-100 hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <span>💬</span>
              {getString('contact_via_whatsapp') || 'Contact via WhatsApp'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetail;