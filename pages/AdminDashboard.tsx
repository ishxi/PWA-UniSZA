
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, JobPost, Application, SlotState } from '../types';
import ProfileSettings from '../components/ProfileSettings';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import UserManagementTable from '../components/UserManagementTable';
import UserProfileDetail from '../components/UserProfileDetail';
import RatingModal from '../components/RatingModal';
import Navbar from '../components/Navbar';
import { EnhancedStorage } from '../src/services/storage';
import { getString } from '../src/constants/i18n';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  jobs: JobPost[];
  applications: Application[];
  onDeleteJob: (id: string) => void;
  onUpdateUser: (u: User) => void;
  onUpdateLogo: (url: string) => void;
  onLogout: () => void;
  onSetUsers: (users: User[]) => void;
  onSetJobs: (jobs: JobPost[]) => void;
  appLogo: string;
  onTabChange?: (tab: string) => void;
  isSettingView?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentUser, users, jobs, applications, onDeleteJob, onUpdateUser, onLogout, 
  onSetUsers, appLogo, onTabChange,
  isSettingView = false
}) => {
  const [internalTab, setInternalTab] = useState<'metrics' | 'directory' | 'jobs' | 'maintenance' | 'user-management'>('metrics');
  const [drillDown, setDrillDown] = useState<'seekers' | 'employers'>('seekers');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [batchText, setBatchText] = useState('');
  const [restoreJson, setRestoreJson] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Initialize tab from props or session storage
  useEffect(() => {
    if (onTabChange) {
      // Sync internal state with prop if provided
      // Keep internal state for internal navigation
    }
    const savedTab = EnhancedStorage.getCurrentTab();
    if (savedTab && savedTab !== internalTab) {
      setInternalTab(savedTab as any);
    }
  }, []);

  // Save tab to session storage when it changes
  useEffect(() => {
    EnhancedStorage.saveCurrentTab(internalTab);
  }, [internalTab]);

  // Handle external tab changes from Navbar
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      setInternalTab('metrics');
    }
    onTabChange?.(tab);
  };

  const handleLogout = () => {
    onLogout();
  };

  const stats = [
    { id: 'seekers', label: getString('role_student'), val: users.filter(u => u.role === UserRole.JOB_SEEKER).length, icon: '🎓' },
    { id: 'employers', label: getString('role_employer'), val: users.filter(u => u.role === UserRole.EMPLOYER).length, icon: '🏢' },
    { id: 'admin', label: getString('role_admin'), val: users.filter(u => u.role === UserRole.ADMIN).length, icon: '🏢' },
    { id: 'jobs', label: getString('jobs'), val: jobs.length, icon: '💼' },
    { id: 'apps', label: getString('status_completed'), val: applications.length, icon: '✅' }
  ];

  const sidebarItems = [
    { id: 'metrics', label: 'Analytics', icon: '📊' },
    { id: 'directory', label: 'Users', icon: '👥' },
    { id: 'jobs', label: 'Jobs', icon: '📋' },
    ...(currentUser.role === UserRole.OWNER ? [{ id: 'user-management', label: 'User DB', icon: '🗃️' }] : []),
    ...(currentUser.role === UserRole.OWNER || currentUser.role === UserRole.ADMIN ? [{ id: 'maintenance', label: 'Maintenance', icon: '🛠️' }] : [])
  ];

  const handleBatchImport = () => {
    const lines = batchText.split('\n').filter(l => l.trim().includes(','));
    const newUsers: User[] = lines.map(line => {
      const [name, uname, roleStr] = line.split(',').map(s => s.trim());
      const role = roleStr?.toUpperCase() === 'EMPLOYER' ? UserRole.EMPLOYER : UserRole.JOB_SEEKER;
      return {
        id: `batch-${Date.now()}-${Math.random()}`,
        username: uname,
        password: 'password',
        role: role,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
        phoneNumber: '60123456789',
        profile: role === UserRole.JOB_SEEKER ? { major: 'Unspecified', hourlyAvailability: {} } : undefined,
        employerProfile: role === UserRole.EMPLOYER ? { companyName: name } : undefined
      };
    });
    
    if (newUsers.length > 0) {
      onSetUsers([...users, ...newUsers]);
      setBatchText('');
      alert(`Imported ${newUsers.length} users successfully!`);
    }
  };

  const handleExportBackup = () => {
    const backupData = EnhancedStorage.exportData();
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cafes_Little_Helper_Backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const processRestore = (jsonString: string) => {
    if (!jsonString.trim()) return;
    if (confirm("RESTORE: Overwrite current data with this file? All existing data will be lost.")) {
      const success = EnhancedStorage.importData(jsonString);
      if (success) {
        alert("Database successfully restored! Reloading system...");
        window.location.reload(); 
      } else {
        alert("Invalid file format. Ensure it contains valid 'users', 'jobs', or 'applications' data.");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processRestore(content);
    };
    reader.readAsText(file);
  };

  const renderMainView = () => {
    // Handle main navigation tabs
    if (activeTab === 'info') {
      return (
        <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-500 pb-28 md:pb-10">
          <div className="bg-white p-6 lg:p-8 rounded-2xl border border-purple-50 shadow-xl">
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight mb-6">
              {getString('info') || 'Information'}
            </h3>
            <div className="prose max-w-none">
              <p className="text-slate-600 mb-4">
                Welcome to Cafe's Little Helper! This system helps manage job opportunities for students.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-purple-50 rounded-xl">
                  <h4 className="font-bold text-purple-800 mb-2">For Students</h4>
                  <p className="text-sm text-purple-600">Browse and apply for part-time jobs, manage your availability, and track applications.</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-bold text-blue-800 mb-2">For Employers</h4>
                  <p className="text-sm text-blue-600">Post job opportunities, review applications, and manage your workforce.</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-2">For Admins</h4>
                  <p className="text-sm text-green-600">Manage users, monitor system health, and handle maintenance tasks.</p>
                </div>
                <div className="p-6 bg-amber-50 rounded-xl">
                  <h4 className="font-bold text-amber-800 mb-2">Support</h4>
                  <p className="text-sm text-amber-600">Contact luqmanlixe98@gmail.com for any issues or questions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'settings') {
      return <ProfileSettings user={currentUser} onUpdate={onUpdateUser} onLogout={onLogout} onTabChange={handleTabChange} />;
    }

    if (isSettingView) return <ProfileSettings user={currentUser} onUpdate={onUpdateUser} onLogout={onLogout} onTabChange={handleTabChange} />;

    switch(internalTab) {
case 'metrics':
        return (
          <div className="space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom duration-500 pb-28 md:pb-10">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
              {stats.map(stat => (
                <div key={stat.id} className="group bg-white p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 flex items-center justify-center text-xl lg:text-2xl group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[9px] lg:text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-none mb-2">{stat.label}</p>
                    <p className="text-xl lg:text-2xl font-bold text-slate-900 tabular-nums">{stat.val.toLocaleString()}</p>
                    <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: `${Math.min((stat.val / Math.max(...stats.map(s => s.val))) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced System Health & Backup Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
               {/* System Health */}
                <div className="lg:col-span-2 bg-white p-6 lg:p-8 rounded-2xl border border-purple-50 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">{getString('system_health')}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-medium text-green-600 uppercase tracking-wider">Live</span>
                    </div>
                  </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg">🗄️</div>
                        <div>
                          <p className="text-[10px] font-medium text-green-700 uppercase tracking-wider">{getString('active_database')}</p>
                          <p className="text-base font-bold text-green-800">Operational</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg">👥</div>
                        <div>
                          <p className="text-[10px] font-medium text-blue-700 uppercase tracking-wider">Active Sessions</p>
                          <p className="text-base font-bold text-blue-800">{users.length}</p>
                        </div>
                      </div>
                    </div>
                 </div>
                 
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{getString('storage_footprint')}</p>
                      <p className="text-sm font-bold text-slate-600">{((JSON.stringify(localStorage).length / 1024).toFixed(2))} KB</p>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${(JSON.stringify(localStorage).length / (5120 * 1024)) * 100}%` }} />
                    </div>
                    <p className="text-[8px] text-slate-400">Max: 5MB</p>
                  </div>

                 {/* Performance Metrics */}
                 <div className="border-t border-purple-100 pt-6">
                   <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-3">Performance Metrics</h4>
                   <div className="grid grid-cols-3 gap-4">
                     <div className="text-center p-4 bg-purple-50 rounded-xl">
                       <p className="text-xl font-bold text-purple-600">98%</p>
                       <p className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">Uptime</p>
                     </div>
                     <div className="text-center p-4 bg-blue-50 rounded-xl">
                       <p className="text-xl font-bold text-blue-600">1.2s</p>
                       <p className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">Avg Load</p>
                     </div>
                     <div className="text-center p-4 bg-green-50 rounded-xl">
                       <p className="text-xl font-bold text-green-600">A+</p>
                       <p className="text-[8px] font-medium text-slate-500 uppercase tracking-wider">Health</p>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Backup System */}
               {currentUser.role === UserRole.OWNER && (
                 <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-purple-50 shadow-2xl flex flex-col justify-center items-center text-center space-y-6 hover:shadow-3xl transition-all">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center text-4xl">💾</div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">{getString('backup_system')}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{getString('instant_backup')}</p>
                    </div>
                    <div className="space-y-3 w-full">
                       <button onClick={handleExportBackup} className="w-full bg-gradient-to-r from-slate-900 to-purple-900 text-white px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105">
                         Export Backup
                       </button>
                      <div className="text-[8px] text-slate-400">
                        Last backup: {new Date().toLocaleDateString()}
                      </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Activity Chart */}
            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-purple-50 shadow-xl">
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight mb-5">Recent Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-purple-50 rounded-2xl">
                   <p className="text-[10px] font-medium text-purple-600 uppercase tracking-wider mb-2">New Users Today</p>
                   <p className="text-xl font-bold text-purple-800">0</p>
                   <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider mb-2">Jobs Posted</p>
                   <p className="text-xl font-bold text-blue-800">{jobs.length}</p>
                   <p className="text-[10px] font-medium text-green-600 uppercase tracking-wider mb-2">Applications</p>
                   <p className="text-xl font-bold text-green-800">{applications.length}</p>
                </div>
              </div>
            </div>
          </div>
        );
case 'directory':
        return (
          <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-500 pb-28 md:pb-10">
             {/* Enhanced Filter Tabs */}
             <div className="bg-white p-2 rounded-2xl border border-purple-50 shadow-xl inline-flex">
               {['seekers', 'employers', 'admin'].map((role) => (
                 <button 
                   key={role}
                   onClick={() => setDrillDown(role as any)}
                   className={`px-8 py-3 rounded-xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest transition-all ${
                     drillDown === role 
                       ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                       : 'text-slate-400 hover:text-purple-600'
                   }`}
                 >
                   {role === 'seekers' ? getString('role_student') : role === 'employers' ? getString('role_employer') : getString('role_admin')}
                   <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-[8px]">
                     {users.filter(u => u.role === (role === 'seekers' ? UserRole.JOB_SEEKER : role === 'employers' ? UserRole.EMPLOYER : UserRole.ADMIN)).length}
                   </span>
                 </button>
               ))}
             </div>

             {/* Enhanced User Grid for Desktop */}
             <div className="hidden lg:block">
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 {users.filter(u => u.role === (drillDown === 'seekers' ? UserRole.JOB_SEEKER : drillDown === 'employers' ? UserRole.EMPLOYER : UserRole.ADMIN)).map(u => (
                   <div key={u.id} className="bg-white p-8 rounded-[2.5rem] border border-purple-50 shadow-2xl hover:shadow-3xl transition-all group cursor-pointer" onClick={() => setSelectedUser(u)}>
                     <div className="flex items-start justify-between mb-6">
                       <div className="flex items-center gap-4">
                         <div className="relative">
                           <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random&color=fff`} 
                                className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform" alt="" />
                           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                         </div>
                         <div>
                           <h3 className="text-lg font-black text-slate-900">{u.firstName} {u.lastName}</h3>
                           <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">@{u.username}</p>
                           <div className="mt-2">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                               u.role === UserRole.JOB_SEEKER ? 'bg-blue-100 text-blue-700' :
                               u.role === UserRole.EMPLOYER ? 'bg-green-100 text-green-700' :
                               'bg-purple-100 text-purple-700'
                             }`}>
                               {u.role}
                             </span>
                           </div>
                         </div>
                       </div>
                       <button className="p-3 bg-purple-50 rounded-xl text-purple-600 hover:bg-purple-600 hover:text-white transition-all">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                         </svg>
                       </button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                         <p className="font-bold text-slate-600 truncate">{u.email || 'N/A'}</p>
                       </div>
                       <div>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                         <p className="font-bold text-slate-600">{u.phoneNumber || 'N/A'}</p>
                       </div>
                       {u.role === UserRole.JOB_SEEKER && (
                         <>
                           <div>
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Major</p>
                             <p className="font-bold text-slate-600">{u.profile?.major || 'N/A'}</p>
                           </div>
                           <div>
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Skills</p>
                             <div className="flex flex-wrap gap-1">
                               {(u.profile?.skills || []).slice(0, 2).map(skill => (
                                 <span key={skill} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-[8px] font-bold">
                                   {skill}
                                 </span>
                               ))}
                               {(u.profile?.skills || []).length > 2 && (
                                 <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold">
                                   +{(u.profile?.skills || []).length - 2}
                                 </span>
                               )}
                             </div>
                           </div>
                         </>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             {/* Mobile/Tableble View */}
             <div className="lg:hidden bg-white rounded-[2.5rem] border border-purple-50 shadow-2xl overflow-hidden">
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-purple-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-purple-100">
                      <tr>
                        <th className="px-6 py-4">{getString('personal_info')}</th>
                        <th className="px-6 py-4">{getString('contact')}</th>
                        <th className="px-6 py-4 text-right">{getString('quick_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {users.filter(u => u.role === (drillDown === 'seekers' ? UserRole.JOB_SEEKER : drillDown === 'employers' ? UserRole.EMPLOYER : UserRole.ADMIN)).map(u => (
                        <tr key={u.id} className="hover:bg-purple-50/20 transition-all cursor-pointer group" onClick={() => setSelectedUser(u)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=random&color=fff`} 
                                   className="w-12 h-12 rounded-xl object-cover shadow-md group-hover:scale-110 transition" alt="" />
                              <div>
                                <p className="font-bold text-slate-900 text-sm leading-none mb-1">{u.firstName} {u.lastName}</p>
                                <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">@{u.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{u.phoneNumber || 'No Phone'}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-[9px] font-black text-purple-600 uppercase tracking-widest border border-purple-100 px-4 py-2 rounded-xl bg-white hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                              {getString('profile')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
               </div>
             </div>
          </div>
        );
case 'jobs':
        return (
          <div className="space-y-8 lg:space-y-12 animate-in slide-in-from-right duration-500 pb-28 md:pb-10">
            {/* Jobs Header with Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">Job Management</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                  {jobs.length} Total Jobs &bull; {jobs.filter(j => j.status === 'active').length} Active
                </p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Active</p>
                  <p className="text-lg font-black text-green-700">{jobs.filter(j => j.status === 'active').length}</p>
                </div>
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Total</p>
                  <p className="text-lg font-black text-slate-700">{jobs.length}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {jobs.map(j => (
                <div key={j.id} className="group bg-white p-8 lg:p-10 rounded-[2.5rem] border border-purple-50 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  {/* Status Badge */}
                  <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                      j.status === 'active' ? 'bg-green-100 text-green-700' : 
                      j.status === 'closed' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {j.status}
                    </span>
                  </div>

                  {/* Job Content */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-xl">
                        💼
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl lg:text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-purple-600 transition-colors">
                          {j.title}
                        </h3>
                        <p className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase tracking-widest">
                          {j.employerName}
                        </p>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">📍</span>
                        <span className="font-bold text-slate-600">{j.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">💰</span>
                        <span className="font-bold text-slate-600">{j.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">⏱️</span>
                        <span className="font-bold text-slate-600">{j.jobType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">👥</span>
                        <span className="font-bold text-slate-600">{j.preferredGender || 'Open'}</span>
                      </div>
                    </div>

                    {/* Description Preview */}
                    <div className="p-4 bg-slate-50 rounded-xl mb-6">
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {j.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(confirm('Permanently delete this job?')) onDeleteJob(j.id); }}
                      className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-black hover:bg-red-600 hover:text-white transition-all text-[10px] tracking-widest uppercase"
                    >
                      {getString('delete')}
                    </button>
                    <button className="px-4 py-3 bg-purple-50 text-purple-600 rounded-xl font-black hover:bg-purple-600 hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {jobs.length === 0 && (
              <div className="bg-white p-12 rounded-2xl border border-purple-50 shadow-xl text-center">
                <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                  📋
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Posted</h3>
                <p className="text-slate-400">Jobs posted by employers will appear here for management.</p>
              </div>
            )}
          </div>
        );
case 'maintenance':
        return (
          <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-500 pb-28 md:pb-20">
            {/* Maintenance Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 lg:p-8 rounded-2xl text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                  🛠️
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-black tracking-tighter">System Maintenance</h3>
                   <p className="text-[10px] font-medium uppercase tracking-wider text-white/80 mt-2">
                    Advanced Administrative Tools
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                   <p className="text-[9px] font-medium uppercase tracking-wider text-white/70 mb-1">Database Size</p>
                   <p className="text-[9px] font-medium uppercase tracking-wider text-white/70 mb-1">Total Records</p>
                   <p className="text-[9px] font-medium uppercase tracking-wider text-white/70 mb-1">Last Backup</p>
                  <p className="text-xl font-black">Never</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* System Restore */}
              <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-purple-50 shadow-2xl space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-2xl">
                      🔄
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-900 tracking-tight">{getString('system_restore')}</h3>
                       <p className="text-[10px] font-medium text-red-400 uppercase tracking-wider">Danger Zone</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                     className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-xs uppercase tracking-wider shadow-lg hover:bg-purple-700 transition-all"
                  >
                    {getString('select_json_file')}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
                </div>
                
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                       <p className="text-sm font-bold text-red-700 uppercase tracking-wider mb-2">Critical Warning</p>
                      <p className="text-xs text-red-600 leading-relaxed">
                        This action will permanently overwrite all existing data including users, jobs, and applications. 
                        This process cannot be undone. Ensure you have a current backup before proceeding.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                     <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Backup JSON Data</label>
                  <textarea 
                    value={restoreJson}
                    onChange={e => setRestoreJson(e.target.value)}
                    placeholder='{"users": [...], "jobs": [...], "applications": [...]}' 
                    className="w-full h-64 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-purple-200 outline-none font-mono text-xs leading-relaxed focus:ring-4 focus:ring-purple-50 transition-all"
                  />
                </div>

                <button 
                  onClick={() => processRestore(restoreJson)} 
                   className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 rounded-xl shadow-lg text-xs uppercase tracking-[0.2em] transform transition active:scale-95 hover:from-red-700 hover:to-red-800"
                >
                  {getString('restore_textarea')}
                </button>
              </div>

              {/* Quick User Import */}
              <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-purple-50 shadow-2xl space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{getString('quick_user_import')}</h3>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Bulk Operations</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-sm font-black text-blue-700 uppercase tracking-widest mb-2">Import Format</p>
                  <p className="text-xs text-blue-600 font-mono">Full Name, username, ROLE</p>
                  <p className="text-xs text-blue-500 mt-2">Valid roles: SEEKER, EMPLOYER, ADMIN, OWNER</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Data (CSV Format)</label>
                  <textarea 
                    value={batchText}
                    onChange={e => setBatchText(e.target.value)}
                    placeholder='John Doe, johndoe123, SEEKER&#10;Jane Smith, janesmith456, EMPLOYER' 
                    className="w-full h-40 p-6 bg-slate-50 rounded-2xl border border-purple-100 outline-none font-mono text-xs focus:ring-4 focus:ring-purple-50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleBatchImport} 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black py-4 rounded-2xl shadow-xl text-[10px] uppercase tracking-widest transition hover:from-blue-700 hover:to-blue-800"
                  >
                    {getString('execute_import')}
                  </button>
                  <button 
                    onClick={() => setBatchText('')}
                    className="bg-slate-100 text-slate-600 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition hover:bg-slate-200"
                  >
                    Clear
                  </button>
                </div>

                {/* Import Preview */}
                {batchText && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-2">Preview</p>
                    <div className="space-y-1">
                      {batchText.split('\n').filter(line => line.trim()).slice(0, 3).map((line, i) => {
                        const [name, username, role] = line.split(',').map(s => s.trim());
                        return (
                          <div key={i} className="text-xs text-green-700">
                            {name} → {username} ({role})
                          </div>
                        );
                      })}
                      {batchText.split('\n').filter(line => line.trim()).length > 3 && (
                        <div className="text-xs text-green-600 font-black">
                          +{batchText.split('\n').filter(line => line.trim()).length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Tools */}
            <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-purple-50 shadow-2xl">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-8">Additional Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="p-6 bg-purple-50 rounded-2xl border border-purple-100 hover:bg-purple-100 transition-all text-left group">
                  <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    🧹
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">Clear Cache</h4>
                  <p className="text-xs text-slate-500">Remove temporary data and cached files</p>
                </button>
                
                <button className="p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all text-left group">
                  <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    🔍
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">Data Validation</h4>
                  <p className="text-xs text-slate-500">Check data integrity and consistency</p>
                </button>
                
                <button className="p-6 bg-green-50 rounded-2xl border border-green-100 hover:bg-green-100 transition-all text-left group">
                  <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                    📊
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">Generate Report</h4>
                  <p className="text-xs text-slate-500">Create system analytics report</p>
                </button>
              </div>
            </div>
          </div>
        );
      case 'user-management':
        return (
          <UserManagementTable 
            users={users} 
            onUpdateUser={onUpdateUser} 
            onSetUsers={onSetUsers} 
          />
        );
       default: return null;
    }
  };

return (
      <div className="pb-20 lg:pb-6">
      {/* Main Navigation Bar */}
      <Navbar
        appLogo={appLogo}
        role={currentUser.role}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
      />
      
      {/* Quick Navigation - Mobile */}
      {onTabChange && !isSettingView && activeTab === 'dashboard' && (
        <div className="lg:hidden flex gap-2 p-4 overflow-x-auto no-scrollbar bg-white border-b border-slate-100">
          <button
            onClick={() => handleTabChange('dashboard')}
            className="flex-shrink-0 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium"
          >
            🏠 {getString('home')}
          </button>
          <button
            onClick={() => handleTabChange('info')}
            className="flex-shrink-0 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium"
          >
            ℹ️ {getString('info')}
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className="flex-shrink-0 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium"
          >
            ⚙️ {getString('settings')}
          </button>
        </div>
      )}

      {/* Mobile Navigation Dropdown */}
      {!isSettingView && activeTab === 'dashboard' && (
        <div className="md:hidden relative mb-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">
                {sidebarItems.find(item => item.id === internalTab)?.icon || '📊'}
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {sidebarItems.find(item => item.id === internalTab)?.label || 'Dashboard'}
              </span>
            </div>
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
           {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
                {/* Main Navigation Options */}
                <div className="p-2 border-b border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">Main Menu</p>
                  {[
                    { id: 'dashboard', label: getString('home') || 'Home', icon: '🏠' },
                    { id: 'info', label: getString('info') || 'Info', icon: 'ℹ️' },
                    { id: 'settings', label: getString('settings') || 'Settings', icon: '⚙️' }
                  ].map(item => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        handleTabChange(item.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full p-3 flex items-center gap-3 transition-all rounded-lg ${
                        activeTab === item.id 
                          ? 'bg-purple-50 text-purple-600' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
                {/* Internal Navigation Options */}
                <div className="p-2">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">Dashboard</p>
                  {sidebarItems.map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => {
                        setInternalTab(item.id as any);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full p-3 flex items-center gap-3 transition-all rounded-lg ${
                        internalTab === item.id 
                          ? 'bg-purple-50 text-purple-600' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Desktop Horizontal Navigation */}
      {!isSettingView && activeTab === 'dashboard' && (
        <div className="hidden md:flex justify-center mb-6">
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm gap-1">
            {/* Main Navigation */}
            {[
              { id: 'dashboard', label: getString('home') || 'Home', icon: '🏠' },
              { id: 'info', label: getString('info') || 'Info', icon: 'ℹ️' },
              { id: 'settings', label: getString('settings') || 'Settings', icon: '⚙️' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === item.id 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <div className="w-px bg-slate-200 mx-2" />
            {/* Dashboard Navigation */}
            {sidebarItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setInternalTab(item.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  internalTab === item.id 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="min-w-0">{renderMainView()}</main>

      {/* User Profile Detail Modal */}
      {selectedUser && (
        <UserProfileDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

    </div>
  );
};

export default AdminDashboard;
