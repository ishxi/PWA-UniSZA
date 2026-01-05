
import React, { useState, useMemo, useEffect } from 'react';
import { User, AvailabilityStatus, JobPost, JobStatus, Application, SlotState, ApplicationStatus } from '../types';
import ProfileSettings from '../components/ProfileSettings';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import SearchBar from '../components/SearchBar';
import ViewToggle from '../components/ViewToggle';
import RatingModal from '../components/RatingModal';
import UserProfileDetail from '../components/UserProfileDetail';
import GuidelineModal from '../components/GuidelineModal';
import { getUIAvatar, getJobIcon } from '../src/utils/uiHelpers';
import { getString } from '../src/constants/i18n';
import {
  getRecentSearches,
  getViewPreferences,
  saveViewPreferences,
  generateSearchSuggestions,
  createAdvancedFilter
} from '../src/utils/searchUtils';

interface JobSeekerDashboardProps {
  user: User;
  allJobs: JobPost[];
  allUsers: User[];
  applications: Application[];
  onUpdate: (user: User) => void;
  onLogout: () => void;
  onApply: (id: string) => void;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const JobSeekerDashboard: React.FC<JobSeekerDashboardProps> = ({ 
  user, allJobs, allUsers, applications, onUpdate, onLogout, onApply, onTabChange, activeTab = 'home', onShowToast 
}) => {
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [jobSearch, setJobSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({ role: 'all', status: 'all', location: 'all', jobType: 'all', salaryRange: 'all' });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [ratingApp, setRatingApp] = useState<Application | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showGuideline, setShowGuideline] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showConfirmApply, setShowConfirmApply] = useState(false);

  useEffect(() => {
    const viewPrefs = getViewPreferences();
    setViewMode(viewPrefs.defaultView);
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    saveViewPreferences({ defaultView: viewMode });
  }, [viewMode]);

  const searchSuggestions = useMemo(() => {
    const searchHistory = getRecentSearches(10);
    return generateSearchSuggestions(
      jobSearch,
      allJobs,
      ['title', 'employerName', 'location', 'description'],
      searchHistory.map(query => ({ query, timestamp: new Date().toISOString() }))
    );
  }, [allJobs, jobSearch]);

  const filteredJobs = useMemo(() => {
    const advancedFilter = createAdvancedFilter(filters);
    
    return allJobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
                          (job.employerName && job.employerName.toLowerCase().includes(jobSearch.toLowerCase())) ||
                          (job.location && job.location.toLowerCase().includes(jobSearch.toLowerCase()));
      const matchesGender = !job.preferredGender || 
                          job.preferredGender === 'OPEN' ||
                          !user.profile?.gender ||
                          job.preferredGender === user.profile.gender;
      const matchesStatus = job.status === JobStatus.AVAILABLE;
      const matchesAdvancedFilters = advancedFilter(job);
      
      return matchesSearch && matchesGender && matchesStatus && matchesAdvancedFilters;
    });
  }, [allJobs, jobSearch, user.profile?.gender, filters]);

  const updateHourState = (day: string, hour: string, state: SlotState) => {
    const current = user.profile?.hourlyAvailability || {};
    const dayData = { ...(current[day] || {}) };
    
    if (state === 'EMPTY') {
      delete dayData[hour];
    } else {
      dayData[hour] = state;
    }

    const updatedUser = {
      ...user,
      profile: {
        ...user.profile!,
        hourlyAvailability: { ...current, [day]: dayData }
      }
    };
    onUpdate(updatedUser);
  };

  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return 'bg-green-500 text-white';
      case ApplicationStatus.REJECTED:
        return 'bg-rose-500 text-white';
      case ApplicationStatus.PENDING:
        return 'bg-amber-500 text-white';
      case ApplicationStatus.COMPLETED:
        return 'bg-blue-600 text-white';
      default:
        return 'bg-purple-600 text-white';
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return getString('status_approved');
      case ApplicationStatus.REJECTED:
        return getString('status_rejected');
      case ApplicationStatus.PENDING:
        return getString('status_pending');
      case ApplicationStatus.COMPLETED:
        return getString('status_completed');
      default:
        return status;
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setIsApplying(true);
    try {
      await onApply(selectedJob.id);
      onShowToast?.(getString('application_sent'), 'success');
      setShowConfirmApply(false);
      setSelectedJob(null);
    } catch (error) {
      onShowToast?.('Failed to apply', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const handleStudentRating = async (score: number, feedback: string) => {
    if (!ratingApp) return;
    try {
      const updatedApp = {
        ...ratingApp,
        studentRating: score,
        studentFeedback: feedback,
        ratedAt: new Date().toISOString()
      };
      onUpdate(updatedApp);
      onShowToast?.('Rating submitted successfully', 'success');
      setShowRatingModal(false);
      setRatingApp(null);
    } catch (error) {
      onShowToast?.('Failed to submit rating', 'error');
    }
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return <ProfileSettings user={user} onUpdate={onUpdate} onLogout={onLogout} onTabChange={onTabChange} />;
    }

    if (activeTab === 'applications') {
      const pendingApps = applications.filter(a => a.status === ApplicationStatus.PENDING);
      const approvedApps = applications.filter(a => a.status === ApplicationStatus.APPROVED);
      const completedApps = applications.filter(a => a.status === ApplicationStatus.COMPLETED);
      const otherApps = applications.filter(a => a.status !== ApplicationStatus.PENDING && a.status !== ApplicationStatus.APPROVED && a.status !== ApplicationStatus.COMPLETED);

      return (
        <div className="space-y-4 animate-in fade-in duration-500 text-left px-2 sm:px-0 pb-24">
          <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-1">{getString('my_applications')}</h2>
            <p className="text-xs text-slate-500">{applications.length} jumlah permohonan</p>
          </div>

          {pendingApps.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">⏳</span>
                <h3 className="font-bold text-amber-700">{getString('waiting_response')} ({pendingApps.length})</h3>
              </div>
              <div className="space-y-3">
                {pendingApps.map(app => {
                  const job = allJobs.find(j => j.id === app.jobId);
                  const employer = allUsers.find(u => u.id === app.employerId);
                  return (
                    <div key={app.id} className="p-4 bg-amber-50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{job?.title}</p>
                          <p className="text-sm text-slate-500">{job?.employerName}</p>
                        </div>
                        <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                          {getString('status_pending')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {approvedApps.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">✅</span>
                <h3 className="font-bold text-green-700">{getString('status_approved')} ({approvedApps.length})</h3>
              </div>
              <div className="space-y-3">
                {approvedApps.map(app => {
                  const job = allJobs.find(j => j.id === app.jobId);
                  const employer = allUsers.find(u => u.id === app.employerId);
                  return (
                    <div key={app.id} className="p-4 bg-green-50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{job?.title}</p>
                          <p className="text-sm text-slate-500">{job?.employerName}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Diluluskan
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-green-600">Hubungi majikan:</span>
                        {employer?.phoneNumber && (
                          <a
                            href={`https://wa.me/${employer.phoneNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-semibold"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {completedApps.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">⭐</span>
                <h3 className="font-bold text-blue-700">{getString('status_completed')} ({completedApps.length})</h3>
              </div>
              <div className="space-y-3">
                {completedApps.map(app => {
                  const job = allJobs.find(j => j.id === app.jobId);
                  const employer = allUsers.find(u => u.id === app.employerId);
                  const hasEmployerRating = app.employerRating && app.employerRating > 0;
                  const hasStudentRating = app.studentRating && app.studentRating > 0;
                  
                  return (
                    <div key={app.id} className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-800">{job?.title}</p>
                          <p className="text-sm text-slate-500">{job?.employerName}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                          {getString('status_completed')}
                        </span>
                      </div>
                      
                      {hasEmployerRating && (
                        <div className="mb-2 p-2 bg-green-50 rounded-lg">
                          <p className="text-xs font-medium text-green-700">Penilaian Majikan:</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`text-sm ${i < (app.employerRating || 0) ? 'text-amber-400' : 'text-slate-300'}`}>
                                ★
                              </span>
                            ))}
                            <span className="text-xs text-slate-500 ml-1">({app.employerRating})</span>
                          </div>
                          {app.employerFeedback && (
                            <p className="text-xs text-slate-600 mt-1 italic">"{app.employerFeedback}"</p>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3">
                        {hasStudentRating ? (
                          <div className="flex-1">
                            <p className="text-xs font-medium text-blue-700">Penilaian Anda:</p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-sm ${i < (app.studentRating || 0) ? 'text-amber-400' : 'text-slate-300'}`}>
                                  ★
                                </span>
                              ))}
                              <span className="text-xs text-slate-500 ml-1">({app.studentRating})</span>
                            </div>
                            {app.studentFeedback && (
                              <p className="text-xs text-slate-600 mt-1 italic">"{app.studentFeedback}"</p>
                            )}
                          </div>
                             ) : app.status === 'COMPLETED' && !app.studentRating ? (
                              <button
                                onClick={() => {
                                  setRatingApp(app);
                                  setSelectedUser(employer || null);
                                }}
                                className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                              >
                                <span>⭐</span> {getString('rate_employer')}
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">{getString('already_rated')}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}

          {applications.length === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-purple-50 shadow-xl text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{getString('no_applications')}</h3>
              <p className="text-slate-600 mb-4">Mohon kerja dan permohonan anda akan muncul di sini</p>
              <button 
                onClick={() => onTabChange?.('jobs')}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-lg"
              >
                Cari Kerja
              </button>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'jobs') {
      return (
        <div className="space-y-4 animate-in slide-in-from-right duration-500 text-left px-2 sm:px-0 pb-24">
          <div className="bg-white rounded-2xl p-4 border border-purple-50 shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Cari Kerja</h2>
                <p className="text-xs text-slate-500">{filteredJobs.length} kerja tersedia</p>
              </div>
              <ViewToggle view={viewMode} onViewChange={setViewMode} />
            </div>
            <SearchBar 
              onSearch={setJobSearch}
              onFilterChange={setFilters}
              suggestions={searchSuggestions}
              showFilters={true}
              placeholder="Cari kerja, kantin, lokasi..."
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button 
              onClick={() => setFilters({...filters, location: 'all'})}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filters.location === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Semua Lokasi
            </button>
            <button 
              onClick={() => setFilters({...filters, location: 'Kantin FIK'})}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filters.location === 'Kantin FIK' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Kantin FIK
            </button>
            <button 
              onClick={() => setFilters({...filters, location: 'Cafe'})}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filters.location === 'Cafe' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Cafe' Siswi
            </button>
            <button 
              onClick={() => setFilters({...filters, location: 'Kantin Baru'})}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filters.location === 'Kantin Baru' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Kantin Baru
            </button>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map(job => {
                const hasApplied = applications.some(a => a.jobId === job.id && a.seekerId === user.id);
                return (
                  <div 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    className="bg-white rounded-2xl p-5 border border-purple-50 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        💼
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{job.title}</h3>
                        <p className="text-sm text-purple-600 font-medium mt-1">{job.employerName}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-sm">
                            <span className="text-green-500">💰</span>
                            <span className="font-semibold text-green-600">{job.paymentInfo}</span>
                          </span>
                          {job.location && (
                            <span className="flex items-center gap-1 text-sm text-slate-500">
                              <span>📍</span>
                              <span className="truncate">{job.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${
                        hasApplied ? 'bg-slate-100 text-slate-500' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {hasApplied ? 'Dihantar' : 'Mohon Sekarang'}
                      </span>
                      <span className="text-slate-400 text-sm">Details →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-purple-50 shadow-xl overflow-hidden">
              {filteredJobs.map(job => {
                const hasApplied = applications.some(a => a.jobId === job.id && a.seekerId === user.id);
                return (
                  <div 
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="p-4 hover:bg-purple-50/50 transition-all cursor-pointer active:bg-purple-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                        💼
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">{job.title}</h3>
                        <p className="text-sm text-purple-600 font-medium truncate">{job.employerName}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-green-600 text-sm">{job.paymentInfo}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          hasApplied ? 'bg-slate-100 text-slate-500' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {hasApplied ? 'Dihantar' : 'Mohon'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredJobs.length === 0 && (
            <div className="bg-white rounded-2xl p-8 border border-purple-50 shadow-xl text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Tiada kerja dijumpai</h3>
              <p className="text-slate-600 mb-4">Cuba laraskan carian atau penapis anda</p>
              <button 
                onClick={() => { setJobSearch(''); setFilters({ role: 'all', status: 'all', location: 'all', jobType: 'all', salaryRange: 'all' }); }}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      );
    }

    const pendingCount = applications.filter(a => a.status === ApplicationStatus.PENDING).length;
    const approvedCount = applications.filter(a => a.status === ApplicationStatus.APPROVED).length;

    return (
      <div className="space-y-4 animate-in fade-in duration-500 text-left px-2 sm:px-0 pb-24">
        <div className="flex items-center gap-3 py-2">
          <img 
            src={user.avatar || getUIAvatar(`${user.firstName} ${user.lastName}`, 128)}
            className="w-12 h-12 rounded-xl shadow-md object-cover"
            alt={user.firstName}
            onError={(e) => {
              (e.target as HTMLImageElement).src = getUIAvatar(`${user.firstName} ${user.lastName}`, 128);
            }}
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">Hai, {user.firstName}! 👋</h1>
            <p className="text-sm text-slate-500">{user.profile?.major || 'Pelajar'} • Tahun {user.profile?.year || 1}</p>
          </div>
          <button
            onClick={() => setShowGuideline(true)}
            className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all"
            title="Panduan"
          >
            <span className="text-xl">📖</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-200 text-sm">Status Profil</p>
              <p className="font-bold text-lg">
                {user.profile?.status === AvailabilityStatus.AVAILABLE ? '🟢 Available' : '🔴 Tidak Available'}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              {user.profile?.status === AvailabilityStatus.AVAILABLE ? '👁️' : '🔒'}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onUpdate({...user, profile: {...user.profile!, status: AvailabilityStatus.AVAILABLE}})}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                user.profile?.status === AvailabilityStatus.AVAILABLE 
                  ? 'bg-white text-purple-600 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Available
            </button>
            <button 
              onClick={() => onUpdate({...user, profile: {...user.profile!, status: AvailabilityStatus.UNAVAILABLE}})}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                user.profile?.status === AvailabilityStatus.UNAVAILABLE 
                  ? 'bg-white text-slate-600 shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Hidden
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onTabChange?.('jobs')}
            className="bg-white rounded-2xl p-4 border border-purple-50 shadow-lg hover:shadow-xl transition-all active:scale-[0.95] flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-purple-200">
              🔍
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">{filteredJobs.length}</p>
              <p className="text-xs text-slate-500">Kerja Available</p>
            </div>
          </button>
          <button 
            onClick={() => onTabChange?.('applications')}
            className="bg-white rounded-2xl p-4 border border-purple-50 shadow-lg hover:shadow-xl transition-all active:scale-[0.95] flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-green-200">
              📋
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">{applications.length}</p>
              <p className="text-xs text-slate-500">{getString('applications')}</p>
            </div>
          </button>
        </div>

        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-xl">⏳</div>
            <div className="flex-1">
              <p className="font-semibold text-amber-800">{pendingCount} permohonan menunggu</p>
              <p className="text-xs text-amber-600">{getString('waiting_employer')}</p>
            </div>
            <button 
              onClick={() => onTabChange?.('applications')}
              className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold"
            >
              Lihat
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span>📋</span> {getString('latest_applications')}
              </h3>
            <button 
              onClick={() => onTabChange?.('applications')}
              className="text-purple-600 text-sm font-semibold hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {applications.length > 0 ? applications.slice(0, 3).map(app => {
              const job = allJobs.find(j => j.id === app.jobId);
              return (
                <div 
                  key={app.id} 
                  onClick={() => {
                    const employer = allUsers.find(u => u.id === app.employerId);
                    if (employer) setSelectedUser(employer);
                  }}
                  className="p-4 bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer active:bg-purple-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 truncate">{job?.title}</p>
                    <p className="text-xs text-slate-500 truncate">{job?.employerName}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase flex-shrink-0 ml-2 ${getStatusBadgeStyle(app.status)}`}>
                    {getStatusLabel(app.status)}
                  </span>
                </div>
              );
            }) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-slate-500 text-sm">Belum ada permohonan</p>
                <button 
                  onClick={() => onTabChange?.('jobs')}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg"
                >
                  Mula Mencari
                </button>
              </div>
            )}
          </div>
        </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">💡</div>
              <div>
                <p className="font-bold text-blue-800 mb-1">Tip Profil</p>
                <p className="text-sm text-blue-700">Lengkapkan profil anda dengan kemahiran dan ketersediaan untuk meningkatkan peluang!</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50">
        {renderContent()}

        {showGuideline && (
          <GuidelineModal user={user} onClose={() => setShowGuideline(false)} />
        )}

        {selectedJob && (
        <div className="fixed inset-0 bg-purple-950/80 backdrop-blur-sm z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
                        💼
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                        <p className="text-purple-200 text-sm">{selectedJob.employerName}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedJob(null)}
                      className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all active:scale-90"
                    >
                      <span className="text-xl">✕</span>
                    </button>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💰</span>
                        <div>
                          <p className="text-xs text-purple-200">Gaji</p>
                          <p className="font-bold">{selectedJob.paymentInfo}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📍</span>
                        <div>
                          <p className="text-xs text-purple-200">Lokasi</p>
                          <p className="font-bold truncate">{selectedJob.location || 'Tidak dinyatakan'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedJob.schedule && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📅</span>
                    <h4 className="font-bold text-blue-800">Jadual</h4>
                  </div>
                  <p className="text-blue-700">{selectedJob.schedule}</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📋</span>
                  <h4 className="font-bold text-purple-800">Deskripsi Kerja</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">✅</span>
                    <h4 className="font-bold text-slate-700">Keperluan</h4>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-2">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.contactWhatsapp && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💬</span>
                    <h4 className="font-bold text-green-800">Hubungi Majikan</h4>
                  </div>
                  <p className="text-green-700 text-sm mb-3">Ada soalan? Boleh chat terus di WhatsApp!</p>
                  <a 
                    href={`https://wa.me/${selectedJob.contactWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-all"
                  >
                    <span>📱</span>
                    Mesej WhatsApp
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 flex-shrink-0 space-y-3">
              <button 
                onClick={() => setShowConfirmApply(true)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-purple-200 hover:shadow-xl hover:from-purple-700 hover:to-purple-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="text-2xl">✨</span>
                {getString('apply')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmApply && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[500] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                📝
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{getString('confirm_apply')}</h3>
              <p className="text-slate-600 mb-2">{selectedJob.title}</p>
              <p className="text-sm text-slate-500">{selectedJob.employerName}</p>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setShowConfirmApply(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 active:scale-[0.98] transition-all"
              >
                {getString('cancel')}
              </button>
              <button 
                onClick={handleApply}
                disabled={isApplying}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isApplying ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {getString('applying')}
                  </>
                ) : (
                  getString('confirm')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRatingModal && ratingApp && (
        <RatingModal
          application={ratingApp}
          currentUser={user}
          jobSeeker={user}
          employer={allUsers.find(u => u.id === ratingApp.employerId)}
          onSubmitRating={(score, feedback) => handleStudentRating(score, feedback)}
          onClose={() => {
            setShowRatingModal(false);
            setRatingApp(null);
          }}
        />
      )}

      {selectedUser && (
        <UserProfileDetail user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default JobSeekerDashboard;


/* === JOB WORKFLOW APPENDED BLOCK: JOB_SEEKER_HELPERS === */


// Job workflow helpers for job seeker (apply + submit work)
// Malay + English UI text are kept simple and bilingual
import dbService from '../src/services/dbAdapter';

const applyToJob = async (jobId: string, seekerId: string, employerId: string) => {
  await dbService.createApplication({
    jobId,
    seekerId,
    employerId,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  });
  alert('Permohonan dihantar / Application submitted');
};

const submitWork = async (applicationId: string) => {
  await dbService.updateApplication(applicationId, {
    status: 'COMPLETED',
    submittedAt: new Date().toISOString(),
  });
  alert('Kerja dihantar / Work submitted');
};

