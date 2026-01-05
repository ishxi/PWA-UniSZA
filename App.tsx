
import React, { useState, useEffect, useReducer, useCallback, lazy, Suspense, useMemo } from 'react';
import { User, UserRole, JobPost, Application, ApplicationStatus } from './types';
import { APP_LOGO, INITIAL_JOBS, INITIAL_USERS } from './src/constants/constants.base';
import BottomNav from './components/BottomNav';
import GuidelineModal from './components/GuidelineModal';
import { getString } from './src/constants/i18n';
import { getUIAvatar } from './src/utils/uiHelpers';
import { authService } from './src/services/authService';

const JobSeekerDashboard = lazy(() => import('./pages/JobSeekerDashboard'));
const EmployerDashboard = lazy(() => import('./pages/EmployerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

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

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-600">Memuatkan...</p>
    </div>
  </div>
);

const PageLoader: React.FC<{ name: string }> = ({ name }) => (
  <div className="min-h-screen bg-slate-50 p-4">
    <div className="max-w-md mx-auto space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3"></div>
      <div className="h-24 bg-slate-200 rounded-xl"></div>
      <div className="h-24 bg-slate-200 rounded-xl"></div>
      <div className="h-24 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const loadUsers = () => {
    try {
      const s = localStorage.getItem('ej_users');
      return s ? JSON.parse(s) : INITIAL_USERS;
    } catch { return INITIAL_USERS; }
  };

  const loadJobs = () => {
    try {
      const s = localStorage.getItem('ej_jobs');
      return s ? JSON.parse(s) : INITIAL_JOBS;
    } catch { return INITIAL_JOBS; }
  };

  const loadApps = () => {
    try {
      const s = localStorage.getItem('ej_apps');
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  };

  const [users, setUsers] = useState<User[]>(loadUsers());
  const [jobs, setJobs] = useState<JobPost[]>(loadJobs());
  const [applications, setApplications] = useState<Application[]>(loadApps());
  const [appLogo] = useState(APP_LOGO);
  const [showGuideline, setShowGuideline] = useState(false);
  const [employerNotifications, setEmployerNotifications] = useState<EmployerNotification[]>(() => {
    try {
      const saved = localStorage.getItem('ej_employer_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const getDefaultTab = (role: UserRole | undefined) => {
    if (role === UserRole.JOB_SEEKER) return 'home';
    if (role === UserRole.EMPLOYER) return 'dashboard';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(() => {
    const loggedIn = localStorage.getItem('ej_logged_in_user');
    if (loggedIn) {
      try {
        const parsed = JSON.parse(loggedIn);
        return getDefaultTab(parsed.role);
      } catch { return 'dashboard'; }
    }
    return 'dashboard';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const loggedIn = localStorage.getItem('ej_logged_in_user');
      if (loggedIn) {
        const parsed = JSON.parse(loggedIn);
        return loadUsers().find((u: User) => u.id === parsed.id) || parsed;
      }
      return null;
    } catch { return null; }
  });

  useEffect(() => {
    const handler = () => forceUpdate();
    window.addEventListener('ej:languageChanged', handler);
    return () => window.removeEventListener('ej:languageChanged', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('ej_users', JSON.stringify(users));
    if (currentUser) {
      const match = users.find(u => u.id === currentUser.id);
      if (match && JSON.stringify(match) !== JSON.stringify(currentUser)) {
        setCurrentUser(match);
        localStorage.setItem('ej_logged_in_user', JSON.stringify(match));
      }
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ej_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ej_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('ej_employer_notifications', JSON.stringify(employerNotifications));
  }, [employerNotifications]);

  const handleLogin = (username: string, pass: string) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === pass);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('ej_logged_in_user', JSON.stringify(user));
      setActiveTab(getDefaultTab(user.role));
      showToast(`Welcome back, ${user.firstName}!`, 'success');
      return;
    }
    showToast(getString('login_error'), 'error');
  };

  const handleLogout = async () => {
    try {
      authService.logout();
    } catch (error) {
      console.error('Auth service logout error:', error);
    }
    
    setCurrentUser(null);
    
    try {
      localStorage.removeItem('ej_logged_in_user');
      localStorage.removeItem('ej_users');
      localStorage.removeItem('ej_jobs');
      localStorage.removeItem('ej_apps');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      sessionStorage.clear();
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
    
    setActiveTab('dashboard');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleJobUpdate = (job: JobPost) => {
    setJobs(prev => {
      const exists = prev.find(j => j.id === job.id);
      if (exists) return prev.map(j => j.id === job.id ? job : j);
      return [job, ...prev];
    });
  };

  const handleApply = (jobId: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!currentUser) {
        reject();
        return;
      }
      const job = jobs.find(j => j.id === jobId);
      const existingApp = applications.find(a => a.jobId === jobId && a.seekerId === currentUser.id);
      
      if (existingApp) {
        showToast('You have already applied for this job', 'error');
        reject();
        return;
      }

      const newApp: Application = { 
        id: `app-${Date.now()}`, 
        jobId, 
        seekerId: currentUser.id,
        employerId: job?.employerId,
        status: ApplicationStatus.PENDING, 
        createdAt: new Date().toISOString() 
      };
      
      setApplications(prev => [...prev, newApp]);

      if (job?.employerId) {
        const seekerName = `${currentUser.firstName} ${currentUser.lastName}`;
        const notification: EmployerNotification = {
          id: `notif-${Date.now()}`,
          employerId: job.employerId,
          type: 'application',
          message: `${seekerName} has applied for ${job.title}`,
          jobId: job.id,
          applicationId: newApp.id,
          seekerId: currentUser.id,
          seekerName: seekerName,
          jobTitle: job.title,
          read: false,
          createdAt: new Date().toISOString()
        };
        setEmployerNotifications(prev => [notification, ...prev]);
      }

      resolve();
    });
  };

  const handleRatingSubmit = (applicationId: string, rating: number, feedback: string, isEmployerRating: boolean) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        const updatedApp = { ...app };
        if (isEmployerRating) {
          updatedApp.employerRating = rating;
          updatedApp.employerFeedback = feedback;
        } else {
          updatedApp.studentRating = rating;
          updatedApp.studentFeedback = feedback;
        }
        updatedApp.ratedAt = new Date().toISOString();
        return updatedApp;
      }
      return app;
    }));

    const application = applications.find(app => app.id === applicationId);
    if (application) {
      const userId = isEmployerRating ? application.seekerId : application.employerId;
      if (userId) {
        setUsers(prev => prev.map(user => {
          if (user.id === userId) {
            const userApplications = applications.filter(app => 
              (isEmployerRating ? app.seekerId : app.employerId) === userId &&
              (isEmployerRating ? app.employerRating : app.studentRating)
            );
            
            const ratings = userApplications.map(app => 
              isEmployerRating ? app.employerRating! : app.studentRating!
            );
            ratings.push(rating);
            
            const averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
            
            if (user.role === 'JOB_SEEKER') {
              return {
                ...user,
                profile: {
                  ...user.profile!,
                  averageRating,
                  totalRatings: ratings.length
                }
              };
            } else {
              return {
                ...user,
                employerProfile: {
                  ...user.employerProfile!,
                  averageRating,
                  totalRatings: ratings.length
                }
              };
            }
          }
          return user;
        }));
      }
    }
  };

  const getEmployerNotifications = (employerId: string) => {
    return employerNotifications.filter(n => n.employerId === employerId);
  };

  const markNotificationRead = (notificationId: string) => {
    setEmployerNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllNotificationsRead = (employerId: string) => {
    setEmployerNotifications(prev => prev.map(n => 
      n.employerId === employerId ? { ...n, read: true } : n
    ));
  };

  const clearEmployerNotifications = (employerId: string) => {
    setEmployerNotifications(prev => prev.filter(n => n.employerId !== employerId));
  };

  const getUnreadNotificationCount = (employerId: string) => {
    return employerNotifications.filter(n => n.employerId === employerId && !n.read).length;
  };

  const currentPage = useMemo(() => {
    if (!currentUser) return 'auth';
    if (currentUser.role === UserRole.JOB_SEEKER) return 'jobseeker';
    if (currentUser.role === UserRole.EMPLOYER) return 'employer';
    if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.OWNER) return 'admin';
    return 'auth';
  }, [currentUser]);

  useEffect(() => {
    const preloadPage = async () => {
      if (currentPage === 'jobseeker') {
        import('./pages/JobSeekerDashboard');
      } else if (currentPage === 'employer') {
        import('./pages/EmployerDashboard');
      } else if (currentPage === 'admin') {
        import('./pages/AdminDashboard');
      }
    };
    preloadPage();
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'jobseeker':
        return (
          <JobSeekerDashboard
            user={currentUser}
            users={users}
            jobs={jobs}
            applications={applications}
            onUpdateUser={handleUpdateProfile}
            onCreateJob={() => {}}
            onUpdateJob={() => {}}
            onApply={handleApply}
            onUpdateApplication={(app) => setApplications(p => p.map(a => a.id === app.id ? app : a))}
            onLogout={handleLogout}
            onTabChange={setActiveTab}
            onShowToast={showToast}
            allJobs={jobs}
          />
        );
      case 'employer':
        return (
          <EmployerDashboard
            currentUser={currentUser}
            allUsers={users}
            jobs={jobs}
            applications={applications}
            onCreateJob={handleJobUpdate}
            onUpdateJob={handleJobUpdate}
            onUpdateApplication={(app) => setApplications(p => p.map(a => a.id === app.id ? app : a))}
            onShowToast={showToast}
          />
        );
      case 'admin':
        return (
          <AdminDashboard
            users={users}
            jobs={jobs}
            applications={applications}
            onUpdateUser={setUsers}
            onUpdateJob={setJobs}
            onUpdateApplication={setApplications}
            onShowToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthPage 
          appLogo={appLogo} 
          onLogin={handleLogin} 
          onCreateUser={(u: User) => { 
            setUsers(p => [...p, u]); 
            setCurrentUser(u); 
            localStorage.setItem('ej_logged_in_user', JSON.stringify(u));
            showToast('Account created successfully!', 'success');
          }} 
        />
        <ToastContainer toasts={toasts} />
      </Suspense>
    );
  }

  const isStudent = currentUser.role === UserRole.JOB_SEEKER;
  const isEmployer = currentUser.role === UserRole.EMPLOYER;
  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.OWNER;

  const pendingApplicationsCount = useMemo(() => {
    if (currentUser.role === UserRole.JOB_SEEKER) {
      return applications.filter(a => a.seekerId === currentUser.id && a.status === ApplicationStatus.PENDING).length;
    }
    if (currentUser.role === UserRole.EMPLOYER) {
      return applications.filter(a => a.employerId === currentUser.id && a.status === ApplicationStatus.PENDING).length;
    }
    return 0;
  }, [currentUser, applications]);

  const notifications = useMemo(() => {
    if (currentUser.role === UserRole.EMPLOYER) {
      return getEmployerNotifications(currentUser.id);
    }
    return [];
  }, [currentUser, employerNotifications]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="pb-20">
        <div className="w-full px-2 sm:px-4">
          <Suspense fallback={<PageLoader name={currentPage} />}>
            {isAdmin ? (
              <AdminDashboard
                currentUser={currentUser}
                users={users}
                jobs={jobs}
                applications={applications}
                onDeleteJob={(id) => setJobs(prev => prev.filter(j => j.id !== id))}
                onUpdateUser={handleUpdateProfile}
                onUpdateLogo={() => {}}
                onLogout={handleLogout}
                onSetUsers={setUsers}
                onSetJobs={setJobs}
                appLogo={appLogo}
                onTabChange={setActiveTab}
              />
            ) : isStudent ? (
              <JobSeekerDashboard 
                user={currentUser}
                allJobs={jobs}
                allUsers={users}
                applications={applications.filter(a => a.seekerId === currentUser.id)}
                onUpdate={handleUpdateProfile}
                onLogout={handleLogout}
                onApply={handleApply}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onShowToast={showToast}
              />
            ) : isEmployer ? (
              <EmployerDashboard 
                currentUser={currentUser}
                allUsers={users}
                myJobs={jobs.filter(j => j.employerId === currentUser.id)}
                applications={applications}
                onUpdateJob={handleJobUpdate}
                onCreateJob={handleJobUpdate}
                onUpdateUser={handleUpdateProfile}
                onUpdateApplication={(app) => setApplications(p => p.map(a => a.id === app.id ? app : a))}
                onLogout={handleLogout}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onShowToast={showToast}
                notifications={notifications}
                onMarkNotificationRead={markNotificationRead}
                onMarkAllRead={() => markAllNotificationsRead(currentUser.id)}
                onClearNotifications={() => clearEmployerNotifications(currentUser.id)}
                unreadCount={getUnreadNotificationCount(currentUser.id)}
              />
            ) : (
              <div className="p-10 text-center">Unauthorized Access</div>
            )}
          </Suspense>
        </div>
      </main>

      {showGuideline && (
        <GuidelineModal user={currentUser} onClose={() => setShowGuideline(false)} />
      )}

      {(isStudent || isEmployer) && (
        <BottomNav 
          user={currentUser}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unreadCount={pendingApplicationsCount}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[] }> = React.memo(({ toasts }) => {
  return (
    <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[600] space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-4 rounded-xl shadow-lg animate-in slide-in-from-bottom duration-300 flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-rose-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          <span className="text-xl">
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ️'}
          </span>
          <p className="flex-1 font-medium text-sm">{toast.message}</p>
        </div>
      ))}
    </div>
  );
});

export default App;
