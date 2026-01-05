
import React, { useState } from 'react';
import { User, Gender, UserRole } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import { getString } from '../src/constants/i18n';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface ProfileSettingsProps {
  user: User;
  onUpdate: (user: User) => void;
  onLogout: () => void;
  onTabChange?: (tab: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate, onLogout, onTabChange }) => {
  const [formData, setFormData] = useState<User>(user);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [passwordError, setPasswordError] = useState('');

  const isStudent = user.role === UserRole.JOB_SEEKER;
  const isEmployer = user.role === UserRole.EMPLOYER;

  const handleUpdateInfo = () => {
    const newAvatar = getUIAvatar(`${formData.firstName} ${formData.lastName}`, 256);
    onUpdate({ ...formData, avatar: newAvatar });
  };

  const handleChangePassword = () => {
    setPasswordError('');
    if (currentPass !== user.password) {
      setPasswordError('Current password is incorrect');
      return;
    }
    if (newPass.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (newPass !== confirmPass) {
      setPasswordError('Passwords do not match');
      return;
    }
    onUpdate({ ...user, password: newPass });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const sections = [
    { id: 'profile', label: getString('profile'), icon: '👤' },
    { id: 'skills', label: isStudent ? getString('skills') : 'Company', icon: isStudent ? '⭐' : '🏢' },
    { id: 'password', label: getString('sensitive_info'), icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500 pb-24">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">{getString('settings')}</h1>
          <LanguageSwitcher />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                activeSection === section.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-slate-600 shadow-md'
              }`}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {activeSection === 'profile' && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={formData.avatar || getUIAvatar(`${formData.firstName} ${formData.lastName}`, 128)}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-100"
                  alt={formData.firstName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getUIAvatar(`${formData.firstName} ${formData.lastName}`, 128);
                  }}
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{formData.firstName} {formData.lastName}</h2>
                  <p className="text-sm text-purple-600 font-medium">
                    {isStudent ? getString('role_student') : isEmployer ? getString('role_employer') : user.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{getString('first_name')}</label>
                    <input
                      type="text"
                      value={formData.firstName || ''}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{getString('last_name')}</label>
                    <input
                      type="text"
                      value={formData.lastName || ''}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{getString('whatsapp_no')}</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber || ''}
                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+60123456789"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="email@domain.com"
                  />
                </div>

                {isStudent && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">{getString('gender')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, profile: {...formData.profile!, gender: Gender.MALE}})}
                        className={`py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          formData.profile?.gender === Gender.MALE
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>♂️</span> Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, profile: {...formData.profile!, gender: Gender.FEMALE}})}
                        className={`py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          formData.profile?.gender === Gender.FEMALE
                            ? 'bg-pink-500 text-white shadow-lg'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>♀️</span> Female
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpdateInfo}
                className="w-full mt-6 py-4 bg-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-[0.98] transition-all"
              >
                {getString('save')}
              </button>
            </div>
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-xl">
              {isStudent ? (
                <>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>⭐</span> {getString('skills')}
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{getString('course')}</label>
                    <input
                      type="text"
                      value={formData.profile?.major || ''}
                      onChange={e => setFormData({...formData, profile: {...formData.profile!, major: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-500 mb-2">{getString('skills')}</label>
                    <input
                      type="text"
                      value={formData.profile?.skills?.join(', ') || ''}
                      onChange={e => setFormData({
                        ...formData,
                        profile: {...formData.profile!, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Barista, Runner, Kitchen (comma separated)"
                    />
                    <p className="text-xs text-slate-400 mt-1">Separate skills with commas</p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-500 mb-1">{getString('professional_bio')}</label>
                    <textarea
                      value={formData.profile?.bio || ''}
                      onChange={e => setFormData({...formData, profile: {...formData.profile!, bio: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      placeholder="Tell employers about yourself..."
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-500 mb-1">{getString('work_experience')}</label>
                    <textarea
                      value={formData.profile?.experience || ''}
                      onChange={e => setFormData({...formData, profile: {...formData.profile!, experience: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      placeholder="Previous work experience..."
                    />
                  </div>
                </>
              ) : isEmployer ? (
                <>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>🏢</span> Company Information
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={formData.employerProfile?.companyName || ''}
                      onChange={e => setFormData({...formData, employerProfile: {...formData.employerProfile!, companyName: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Company Bio</label>
                    <textarea
                      value={formData.employerProfile?.bio || ''}
                      onChange={e => setFormData({...formData, employerProfile: {...formData.employerProfile!, bio: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      placeholder="Tell students about your company..."
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Business Type</label>
                    <input
                      type="text"
                      value={formData.employerProfile?.businessType || ''}
                      onChange={e => setFormData({...formData, employerProfile: {...formData.employerProfile!, businessType: e.target.value}})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Cafe, Restaurant, Retail"
                    />
                  </div>
                </>
              ) : null}

              <button
                onClick={handleUpdateInfo}
                className="w-full mt-6 py-4 bg-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-[0.98] transition-all"
              >
                {getString('save')}
              </button>
            </div>
          </div>
        )}

        {activeSection === 'password' && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-2xl p-5 border border-red-50 shadow-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>🔒</span> {getString('sensitive_info')}
              </h3>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  {passwordError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={currentPass}
                      onChange={e => setCurrentPass(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showCurrentPass ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.242 4.878l4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPass ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPass ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full mt-6 py-4 bg-red-500 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:bg-red-600 active:scale-[0.98] transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full py-4 bg-white border border-red-200 text-red-500 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <span>🚪</span>
          {getString('logout')}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
