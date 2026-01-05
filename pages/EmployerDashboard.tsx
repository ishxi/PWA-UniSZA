import React, { useEffect, useState } from 'react';
import { User, JobPost, Application, ApplicationStatus } from '../types';
import dbService from '../src/services/dbAdapter';
import { getString } from '../src/constants/i18n';
import RatingModal from '../components/RatingModal';
import StudentProfileDetail from '../components/StudentProfileDetail';
import UserProfileDetail from '../components/UserProfileDetail';
import GuidelineModal from '../components/GuidelineModal';
import ProfileSettings from '../components/ProfileSettings';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface EmployerNotification {
  id: string;
  employerId: string;
  type: 'application' | 'approved' | 'rejected' | 'rating';
  message: string;
  jobId?: string;
  applicationId?: string;
  seekerId?: string;
  seekerName?: string;
  jobTitle?: string;
  read: boolean;
  createdAt: string;
}

interface EmployerDashboardProps {
  currentUser: User;
  allUsers: User[];
  myJobs: JobPost[];
  applications: Application[];
  onUpdateJob: (job: JobPost) => void;
  onCreateJob: (job: JobPost) => void;
  onUpdateUser: (user: User) => void;
  onUpdateApplication: (app: Application) => void;
  onLogout: () => void;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
  notifications?: EmployerNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearNotifications?: () => void;
  unreadCount?: number;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ 
  currentUser, 
  allUsers, 
  myJobs, 
  applications,
  onUpdateJob,
  onCreateJob,
  onUpdateUser,
  onUpdateApplication,
  onLogout,
  onTabChange,
  activeTab = 'dashboard',
  onShowToast,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllRead,
  onClearNotifications,
  unreadCount = 0
}) => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [ratingApp, setRatingApp] = useState<Application | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showGuideline, setShowGuideline] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newJob, setNewJob] = useState<Partial<JobPost>>({
    title: '',
    description: '',
    location: '',
    paymentInfo: '',
    schedule: '',
  });
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobSubTab, setJobSubTab] = useState<'myjobs' | 'applicants'>('myjobs');
  const [talentSubTab, setTalentSubTab] = useState<'mytalents' | 'find'>('find');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [talentSearch, setTalentSearch] = useState('');
  const [talentViewMode, setTalentViewMode] = useState<'grid' | 'list'>('list');
  const [expandedTalents, setExpandedTalents] = useState<Set<string>>(new Set());
  const [talentFilters, setTalentFilters] = useState({ skill: 'all', availability: 'all', rating: 'all' });
  const [showTalentFilters, setShowTalentFilters] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await dbService.listJobs();
      setJobs(data || []);
    } catch (e) {
      console.error(e);
      onShowToast?.('Failed to load jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (job: JobPost) => {
    try {
      const approvedApps = applications.filter((app: Application) => app.jobId === job.id && app.status === ApplicationStatus.APPROVED);
      if (approvedApps.length === 0) {
        onShowToast?.('No approved applications found', 'error');
        return;
      }
      await dbService.markJobCompleted(job.id);
      
      approvedApps.forEach(app => {
        onUpdateApplication({
          ...app,
          status: ApplicationStatus.COMPLETED
        });
      });
      
      onShowToast?.('Job marked as completed', 'success');
      loadJobs();
    } catch (error) {
      onShowToast?.('Failed to complete job', 'error');
    }
  };

  const openRating = (job: JobPost) => {
    const jobApplications = applications.filter((app: Application) => app.jobId === job.id && app.status === ApplicationStatus.COMPLETED);
    if (jobApplications.length > 0) {
      const appToRate = jobApplications.find(app => !app.employerRating);
      if (appToRate) {
        setRatingApp(appToRate);
        setShowRatingModal(true);
      } else {
        onShowToast?.('Already rated this student', 'info');
      }
    } else {
      onShowToast?.('No completed applications found', 'error');
    }
  };

  const submitRating = async (score: number, feedback: string, isEmployerRating: boolean) => {
    if (!ratingApp) return;
    if (ratingApp.employerRating) {
      onShowToast?.('You have already rated this student', 'info');
      setShowRatingModal(false);
      setRatingApp(null);
      return;
    }
    try {
      const seeker = allUsers.find(u => u.id === ratingApp.seekerId);
      if (seeker) {
        onUpdateApplication({
          ...ratingApp,
          employerRating: score,
          employerFeedback: feedback,
          ratedAt: new Date().toISOString()
        });
        onShowToast?.('Rating submitted successfully', 'success');
      }
      setShowRatingModal(false);
      setRatingApp(null);
    } catch (error) {
      onShowToast?.('Failed to submit rating', 'error');
    }
  };

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.description) {
      onShowToast?.('Please fill in all required fields', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const job: JobPost = {
        id: `job-${Date.now()}`,
        employerId: currentUser.id,
        employerName: `${currentUser.firstName} ${currentUser.lastName}`,
        title: newJob.title!,
        description: newJob.description!,
        location: newJob.location || '',
        paymentInfo: newJob.paymentInfo || '',
        schedule: newJob.schedule || '',
        status: 'AVAILABLE' as any,
        createdAt: new Date().toISOString(),
      };
      onCreateJob(job);
      setNewJob({ title: '', description: '', location: '', paymentInfo: '', schedule: '' });
      setShowJobForm(false);
      onShowToast?.('Job posted successfully!', 'success');
    } catch (error) {
      onShowToast?.('Failed to post job', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = (app: Application) => {
    onUpdateApplication({ ...app, status: ApplicationStatus.APPROVED });
    onShowToast?.('Application approved', 'success');
  };

  const handleReject = (app: Application) => {
    onUpdateApplication({ ...app, status: ApplicationStatus.REJECTED });
    onShowToast?.('Application rejected', 'info');
  };

  const jobSeeker = ratingApp ? allUsers.find(u => u.id === ratingApp.seekerId) : null;

  const toggleTalentExpand = (id: string) => {
    const newExpanded = new Set(expandedTalents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTalents(newExpanded);
  };

  const filteredTalents = allUsers.filter(u => u.role === 'JOB_SEEKER').filter(u => {
    const matchesSearch = !talentSearch || 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(talentSearch.toLowerCase()) ||
      u.profile?.skills?.some(s => s.toLowerCase().includes(talentSearch.toLowerCase())) ||
      u.profile?.major?.toLowerCase().includes(talentSearch.toLowerCase());
    const matchesSkill = talentFilters.skill === 'all' || 
      u.profile?.skills?.some(s => s.toLowerCase() === talentFilters.skill.toLowerCase());
    const matchesAvailability = talentFilters.availability === 'all' || u.profile?.status === talentFilters.availability;
    const matchesRating = talentFilters.rating === 'all' || 
      (talentFilters.rating === 'high' && u.profile?.averageRating >= 4) ||
      (talentFilters.rating === 'medium' && u.profile?.averageRating && u.profile.averageRating >= 3 && u.profile.averageRating < 4) ||
      (talentFilters.rating === 'low' && u.profile?.averageRating && u.profile.averageRating < 3) ||
      (talentFilters.rating === 'none' && !u.profile?.averageRating);
    return matchesSearch && matchesSkill && matchesAvailability && matchesRating;
  });

  const renderTalentCard = (seeker: User) => {
    const isExpanded = expandedTalents.has(seeker.id);
    const studentApps = applications.filter(a => a.seekerId === seeker.id);
    const completedJobs = studentApps.filter(a => a.status === 'COMPLETED').length;

    return (
      <div 
        key={seeker.id}
        className="bg-white rounded-2xl border border-purple-50 shadow-lg hover:shadow-xl transition-all overflow-hidden"
      >
        <div 
          className="p-4 cursor-pointer active:bg-purple-50"
          onClick={() => toggleTalentExpand(seeker.id)}
        >
          <div className="flex items-center gap-3">
            <img
              src={seeker.avatar || getUIAvatar(`${seeker.firstName} ${seeker.lastName}`, 64)}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-200 flex-shrink-0"
              alt={seeker.firstName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = getUIAvatar(`${seeker.firstName} ${seeker.lastName}`, 64);
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-800">{seeker.firstName} {seeker.lastName}</h4>
                {seeker.profile?.status === 'AVAILABLE' && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
              <p className="text-sm text-purple-600 font-medium">{seeker.profile?.major || 'Pelajar'}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {seeker.profile?.skills?.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
                {seeker.profile?.skills && seeker.profile.skills.length > 3 && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">
                    +{seeker.profile.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {seeker.profile?.averageRating ? (
                <div className="flex items-center gap-1">
                  <span className="text-amber-500">⭐</span>
                  <span className="font-bold text-slate-700">{seeker.profile.averageRating.toFixed(1)}</span>
                </div>
              ) : (
                <span className="text-slate-400 text-sm">New</span>
              )}
              <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-slate-100 bg-slate-50 p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-purple-600">{seeker.profile?.skills?.length || 0}</p>
                <p className="text-xs text-slate-500">Skills</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-green-600">{completedJobs}</p>
                <p className="text-xs text-slate-500">Jobs Done</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-blue-600">{studentApps.length}</p>
                <p className="text-xs text-slate-500">Applied</p>
              </div>
            </div>

            {seeker.profile?.bio && (
              <div className="mb-4">
                <p className="text-xs text-slate-500 font-medium mb-1">About</p>
                <p className="text-sm text-slate-600 bg-white rounded-lg p-3">{seeker.profile.bio}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedUser(seeker); }}
                className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1"
              >
                <span>👤</span> View Profile
              </button>
              {seeker.phoneNumber && (
                <a
                  href={`https://wa.me/${seeker.phoneNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>💬</span> WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderJobsContent = () => (
    <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>📢</span> {showJobForm ? 'Siarkan Kerja Baru' : 'Kerja Saya'}
        </h2>
        {!showJobForm && (
          <button 
            onClick={() => setShowJobForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg"
          >
            + Tambah Kerja
          </button>
        )}
        {showJobForm && (
          <button 
            onClick={() => setShowJobForm(false)}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            &times;
          </button>
        )}
      </div>
      
      {showJobForm ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Tajuk Kerja *</label>
            <input
              type="text"
              value={newJob.title}
              onChange={(e) => setNewJob({...newJob, title: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
              placeholder="cth., Pembantu Kitchen"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Deskripsi *</label>
            <textarea
              value={newJob.description}
              onChange={(e) => setNewJob({...newJob, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
              rows={4}
              placeholder="Jelaskan tanggungjawab kerja..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Lokasi</label>
              <input
                type="text"
                value={newJob.location}
                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
                placeholder="Lokasi kantin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Gaji</label>
              <input
                type="text"
                value={newJob.paymentInfo}
                onChange={(e) => setNewJob({...newJob, paymentInfo: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
                placeholder="cth., RM8/sejam"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Jadual</label>
            <input
              type="text"
              value={newJob.schedule}
              onChange={(e) => setNewJob({...newJob, schedule: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
              placeholder="cth., Isnin - Jumaat, 9AM - 5PM"
            />
          </div>
          <button 
            onClick={handleCreateJob}
            disabled={isSubmitting}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Memposting...
              </>
            ) : (
              <>
                <span>📢</span>
                Siarkan Sekarang
              </>
            )}
          </button>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500">Memuatkan...</p>
        </div>
      ) : jobs.filter(j => j.employerId === currentUser.id).length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">💼</div>
          <p className="text-slate-500">Belum ada kerja disiarkan</p>
          <button 
            onClick={() => setShowJobForm(true)}
            className="mt-3 px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold shadow-lg"
          >
            Siarkan Kerja Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.filter(j => j.employerId === currentUser.id).map(job => {
            const jobApps = applications.filter(a => a.jobId === job.id);
            const approvedCount = jobApps.filter(a => a.status === 'APPROVED').length;
            const pendingCount = jobApps.filter(a => a.status === 'PENDING').length;
            const completedCount = jobApps.filter(a => a.status === 'COMPLETED').length;
            const hasUnratedCompleted = jobApps.some(a => a.status === 'COMPLETED' && !a.employerRating);
            const allCompletedRated = completedCount > 0 && !hasUnratedCompleted;
            
            return (
              <div key={job.id} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-800">{job.title}</h4>
                    <p className="text-xs text-slate-500">{job.employerName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    job.status === 'AVAILABLE' ? 'bg-green-500 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {job.status === 'AVAILABLE' ? 'Aktif' : job.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                  <span>💰 {job.paymentInfo}</span>
                  {job.location && <span>📍 {job.location}</span>}
                </div>
                {pendingCount > 0 || approvedCount > 0 ? (
                  <div className="flex gap-2 mb-3">
                    {pendingCount > 0 && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                        {pendingCount} menunggu
                      </span>
                    )}
                    {approvedCount > 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {approvedCount} diluluskan
                      </span>
                    )}
                    {completedCount > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {completedCount} selesai
                      </span>
                    )}
                  </div>
                ) : null}
                <div className="flex gap-2">
                  {approvedCount > 0 && (
                    <button 
                      onClick={() => markComplete(job)}
                      className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                    >
                      <span>✓</span> Selesai
                    </button>
                  )}
                  {hasUnratedCompleted && (
                    <button 
                      onClick={() => openRating(job)}
                      className="flex-1 py-2.5 bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1"
                    >
                      <span>⭐</span> Nilaikan
                    </button>
                  )}
                  {allCompletedRated && (
                    <div className="flex-1 py-2.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                      <span>✓</span> Semua Dinilai
                    </div>
                  )}
                  {approvedCount === 0 && completedCount === 0 && (
                    <div className="flex-1 py-2.5 bg-slate-200 text-slate-500 rounded-lg text-xs font-medium flex items-center justify-center">
                      Tiada pelajar diluluskan
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderApplicantsContent = () => {
    const myApplications = applications.filter(app => {
      return app.employerId === currentUser.id;
    });

    const pendingApps = myApplications.filter(a => a.status === ApplicationStatus.PENDING);
    const approvedApps = myApplications.filter(a => a.status === ApplicationStatus.APPROVED);

    return (
      <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>👥</span> Pemohon
        </h2>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-amber-600">{pendingApps.length}</p>
            <p className="text-xs text-amber-600 font-medium">Menunggu</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-600">{approvedApps.length}</p>
            <p className="text-xs text-green-600 font-medium">Diluluskan</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500">Memuatkan...</p>
          </div>
        ) : myApplications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-slate-500">Tiada pemohon lagi</p>
            <p className="text-sm text-slate-400">Pemohon akan muncul di sini apabila pelajar memohon</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myApplications.map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              const seeker = allUsers.find(u => u.id === app.seekerId);
              return (
                <div key={app.id} className="bg-slate-50 rounded-xl overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer active:bg-purple-50"
                    onClick={() => setSelectedUser(seeker || null)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={seeker?.avatar || getUIAvatar(`${seeker?.firstName} ${seeker?.lastName}`, 64)}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200"
                        alt={seeker?.firstName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getUIAvatar(`${seeker?.firstName} ${seeker?.lastName}`, 64);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800">{seeker?.firstName} {seeker?.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{job?.title}</p>
                        {seeker?.profile?.major && (
                          <p className="text-xs text-purple-500">{seeker.profile.major}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase flex-shrink-0 ${
                        app.status === 'APPROVED' ? 'bg-green-500 text-white' :
                        app.status === 'REJECTED' ? 'bg-rose-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        {app.status === 'APPROVED' ? 'Diluluskan' : app.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </div>
                  </div>
                  {app.status === 'PENDING' && (
                    <div className="flex border-t border-slate-200">
                      <button 
                        onClick={() => handleApprove(app)}
                        className="flex-1 py-3 bg-green-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:bg-green-600"
                      >
                        <span>✓</span> Lulus
                      </button>
                      <button 
                        onClick={() => handleReject(app)}
                        className="flex-1 py-3 bg-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:bg-rose-600"
                      >
                        <span>✕</span> Tolak
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <ProfileSettings 
          user={currentUser} 
          onUpdate={onUpdateUser} 
          onLogout={onLogout}
          onTabChange={onTabChange}
        />
      );
    }

    if (activeTab === 'jobs') {
      return (
        <div className="space-y-4 animate-in fade-in duration-500 text-left px-2 sm:px-0 pb-24">
          <div className="bg-white rounded-2xl p-2 border border-purple-50 shadow-xl">
            <div className="flex gap-2">
              <button
                onClick={() => setJobSubTab('myjobs')}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                  jobSubTab === 'myjobs' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                📢 Kerja Saya
              </button>
              <button
                onClick={() => setJobSubTab('applicants')}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                  jobSubTab === 'applicants' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                👥 Pemohon
              </button>
            </div>
          </div>

          {jobSubTab === 'myjobs' ? renderJobsContent() : renderApplicantsContent()}
        </div>
      );
    }

    const myJobCount = jobs.filter(j => j.employerId === currentUser.id).length;
    const activeJobCount = jobs.filter(j => j.employerId === currentUser.id && j.status === 'AVAILABLE').length;
    const myApplications = applications.filter(app => app.employerId === currentUser.id);
    const totalApplicants = myApplications.length;
    const pendingApplicants = myApplications.filter(a => a.status === ApplicationStatus.PENDING).length;

    return (
      <div className="space-y-4 animate-in fade-in duration-500 text-left px-2 sm:px-0 pb-24">
        <div className="flex items-center gap-3 py-2">
          <img 
            src={currentUser.avatar || getUIAvatar(`${currentUser.firstName} ${currentUser.lastName}`, 128)}
            className="w-12 h-12 rounded-xl shadow-md object-cover"
            alt={currentUser.firstName}
            onError={(e) => {
              (e.target as HTMLImageElement).src = getUIAvatar(`${currentUser.firstName} ${currentUser.lastName}`, 128);
            }}
          />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">Hai, {currentUser.firstName}! 👋</h1>
            <p className="text-sm text-slate-500">{currentUser.employerProfile?.companyName || 'Perniagaan'}</p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all relative"
              title={getString('notifications')}
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">{getString('notifications')}</h3>
                  <div className="flex gap-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={onMarkAllRead}
                        className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                      >
                        {getString('mark_as_read')}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <span className="text-4xl mb-2 block">🔔</span>
                      <p className="text-slate-500 text-sm">{getString('no_notifications')}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-slate-50 cursor-pointer transition-all ${!notification.read ? 'bg-purple-50/50' : ''}`}
                          onClick={() => {
                            if (!notification.read && onMarkNotificationRead) {
                              onMarkNotificationRead(notification.id);
                            }
                            if (notification.applicationId) {
                              onTabChange?.('jobs');
                              setJobSubTab('applicants');
                              setShowNotifications(false);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'application' ? 'bg-green-100' : 'bg-blue-100'}`}>
                              <span className="text-lg">{notification.type === 'application' ? '📥' : 'ℹ️'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-800 font-medium">{notification.seekerName}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{getString('new_application')}: {notification.jobTitle}</p>
                              <p className="text-xs text-slate-400 mt-1">
                                {new Date(notification.createdAt).toLocaleDateString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-slate-100">
                    <button
                      onClick={onClearNotifications}
                      className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {getString('clear_all')}
                    </button>
                  </div>
                )}
              </div>
            )}
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Perniagaan</p>
              <p className="font-bold text-lg">{currentUser.employerProfile?.companyName || 'Belum diset'}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              🏢
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => onTabChange?.('jobs')}
            className="bg-white rounded-2xl p-4 border border-purple-50 shadow-lg hover:shadow-xl transition-all active:scale-[0.95] flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-green-200">
              📢
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">{activeJobCount}</p>
              <p className="text-xs text-slate-500">Kerja Aktif</p>
            </div>
          </button>
          <button 
            onClick={() => onTabChange?.('jobs')}
            className="bg-white rounded-2xl p-4 border border-purple-50 shadow-lg hover:shadow-xl transition-all active:scale-[0.95] flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
              👥
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">{totalApplicants}</p>
              <p className="text-xs text-slate-500">Pemohon</p>
            </div>
          </button>
          <button 
            onClick={() => onTabChange?.('dashboard')}
            className="bg-white rounded-2xl p-4 border border-purple-50 shadow-lg hover:shadow-xl transition-all active:scale-[0.95] flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-purple-200">
              🎓
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">{allUsers.filter(u => u.role === 'JOB_SEEKER').length}</p>
              <p className="text-xs text-slate-500">Pelajar</p>
            </div>
          </button>
        </div>

        {pendingApplicants > 0 && (
          <div 
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-amber-100 transition-all"
            onClick={() => {
              onTabChange?.('jobs');
              setJobSubTab('applicants');
            }}
          >
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-xl">⏳</div>
            <div className="flex-1">
              <p className="font-semibold text-amber-800">{pendingApplicants} permohonan menunggu</p>
              <p className="text-xs text-amber-600">Semak dan luluskan permohonan pelajar</p>
            </div>
            <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold">
              Semak
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span>🎓</span> Cari Bakat Pelajar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{filteredTalents.length} pelajar tersedia</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTalentViewMode(talentViewMode === 'list' ? 'grid' : 'list')}
                className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all"
              >
                {talentViewMode === 'list' ? (
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowTalentFilters(!showTalentFilters)}
                className={`p-2 rounded-lg transition-all ${showTalentFilters ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari nama, kemahiran, atau bidang..."
              value={talentSearch}
              onChange={(e) => setTalentSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
            />
          </div>

          {showTalentFilters && (
            <div className="mb-4 p-4 bg-slate-50 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Kemahiran</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {['all', 'Barista', 'Runner', 'Kitchen', 'Cleaning', 'Waiter', 'Cashier'].map(skill => (
                    <button
                      key={skill}
                      onClick={() => setTalentFilters({...talentFilters, skill})}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        talentFilters.skill === skill 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-100'
                      }`}
                    >
                      {skill === 'all' ? 'Semua' : skill}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Ketersediaan</p>
                <div className="flex gap-2">
                  {['all', 'AVAILABLE', 'UNAVAILABLE'].map(status => (
                    <button
                      key={status}
                      onClick={() => setTalentFilters({...talentFilters, availability: status})}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        talentFilters.availability === status 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-100'
                      }`}
                    >
                      {status === 'all' ? 'Semua' : status === 'AVAILABLE' ? 'Available' : 'Busy'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Penilaian</p>
                <div className="flex gap-2">
                  {['all', 'high', 'medium', 'low', 'none'].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setTalentFilters({...talentFilters, rating})}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        talentFilters.rating === rating 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-100'
                      }`}
                    >
                      {rating === 'all' ? 'Semua' : rating === 'high' ? '4+ ⭐' : rating === 'medium' ? '3-4 ⭐' : rating === 'low' ? '<3 ⭐' : 'Baharu'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {['Barista', 'Runner', 'Kitchen', 'Cleaning', 'Waiter', 'Cashier'].map(skill => (
              <button
                key={skill}
                onClick={() => setTalentFilters({...talentFilters, skill: talentFilters.skill === skill ? 'all' : skill})}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  talentFilters.skill === skill 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-purple-100'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-6">
              <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-500 text-sm mt-2">Memuatkan...</p>
            </div>
          ) : talentViewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredTalents.map(seeker => renderTalentCard(seeker))}
              {filteredTalents.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-slate-500 text-sm">Tiada pelajar dijumpai</p>
                  <button 
                    onClick={() => { setTalentSearch(''); setTalentFilters({ skill: 'all', availability: 'all', rating: 'all' }); }}
                    className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTalents.map(seeker => renderTalentCard(seeker))}
              {filteredTalents.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-slate-500 text-sm">Tiada pelajar dijumpai</p>
                  <button 
                    onClick={() => { setTalentSearch(''); setTalentFilters({ skill: 'all', availability: 'all', rating: 'all' }); }}
                    className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span>📋</span> Kerja Saya
            </h3>
            <button 
              onClick={() => onTabChange?.('jobs')}
              className="text-purple-600 text-sm font-semibold hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          {jobs.filter(j => j.employerId === currentUser.id).slice(0, 3).map(job => {
            const jobApps = applications.filter(a => a.jobId === job.id);
            const pendingCount = jobApps.filter(a => a.status === 'PENDING').length;
            
            return (
              <div key={job.id} className="p-4 bg-slate-50 rounded-xl mb-2 last:mb-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 truncate">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.employerName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                    job.status === 'AVAILABLE' ? 'bg-green-500 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {job.status === 'AVAILABLE' ? 'Aktif' : job.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                  <span>💰 {job.paymentInfo}</span>
                  {pendingCount > 0 && (
                    <span className="text-amber-600">{pendingCount} menunggu</span>
                  )}
                </div>
              </div>
            );
          })}
          {jobs.filter(j => j.employerId === currentUser.id).length === 0 && (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">💼</div>
              <p className="text-slate-500 text-sm">Belum ada kerja</p>
              <button 
                onClick={() => onTabChange?.('jobs')}
                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg"
              >
                Tambah Kerja
              </button>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">💡</div>
            <div>
              <p className="font-bold text-blue-800 mb-1">Tip Majikan</p>
              <p className="text-sm text-blue-700">Siarkan kerja dengan deskripsi yang jelas untuk menarik pelajar yang sesuai!</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {renderContent()}

      {showGuideline && (
        <GuidelineModal user={currentUser} onClose={() => setShowGuideline(false)} />
      )}

      {showRatingModal && ratingApp && jobSeeker && (
        <RatingModal
          application={ratingApp}
          currentUser={currentUser}
          jobSeeker={jobSeeker}
          employer={currentUser}
          onSubmitRating={(appId, rating, feedback, isEmployerRating) => submitRating(rating, feedback, isEmployerRating)}
          onClose={() => {
            setShowRatingModal(false);
            setRatingApp(null);
          }}
        />
      )}

      {selectedUser && selectedUser.role === 'JOB_SEEKER' && (
        <StudentProfileDetail 
          user={selectedUser} 
          applications={applications}
          allJobs={jobs}
          onClose={() => setSelectedUser(null)} 
        />
      )}
      {selectedUser && selectedUser.role !== 'JOB_SEEKER' && (
        <UserProfileDetail user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default EmployerDashboard;


/* === JOB WORKFLOW APPENDED BLOCK: EMPLOYER_HELPERS === */


// Job workflow helpers for employer (approve / reject / mark complete / close job)
import dbService from '../src/services/dbAdapter';

const approveApplication = async (applicationId: string) => {
  await dbService.updateApplication(applicationId, {
    status: 'APPROVED',
    updatedAt: new Date().toISOString(),
  });
  alert('Permohonan diluluskan / Application approved');
};

const rejectApplication = async (applicationId: string) => {
  await dbService.updateApplication(applicationId, {
    status: 'REJECTED',
    updatedAt: new Date().toISOString(),
  });
  alert('Permohonan ditolak / Application rejected');
};

const markJobComplete = async (jobId: string) => {
  await dbService.updateJob(jobId, {
    status: 'UNAVAILABLE',
  });
  alert('Kerja selesai / Job marked completed');
};

const closeJob = async (jobId: string) => {
  await dbService.updateJob(jobId, {
    status: 'CLOSED',
  });
  alert('Iklan kerja ditutup / Job closed');
};

