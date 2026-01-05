import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, UserRole, JobPost, Application, ApplicationStatus } from '../../types';
import { loadDemoData } from '../services/demoDataService';
import { EnhancedStorage } from '../services/storage';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  jobs: JobPost[];
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  language: 'en' | 'ms';
  notifications: Notification[];
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_JOBS'; payload: JobPost[] }
  | { type: 'ADD_JOB'; payload: JobPost }
  | { type: 'UPDATE_JOB'; payload: { id: string; updates: Partial<JobPost> } }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'APPLY_FOR_JOB'; payload: { jobId: string; seekerId: string } }
  | { type: 'UPDATE_APPLICATION'; payload: { id: string; status: Application['status'] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'ms' }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  jobs: [],
  applications: [],
  isLoading: false,
  error: null,
  theme: 'light',
  language: 'en',
  notifications: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_JOBS':
      return {
        ...state,
        jobs: action.payload,
      };
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [...state.jobs, action.payload],
      };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload.id ? { ...job, ...action.payload.updates } : job
        ),
      };
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter((job) => job.id !== action.payload),
      };
    case 'APPLY_FOR_JOB':
      const newApplication: Application = {
        id: Date.now().toString(),
        jobId: action.payload.jobId,
        seekerId: action.payload.seekerId,
        status: ApplicationStatus.PENDING,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        applications: [...state.applications, newApplication],
      };
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map((app) =>
          app.id === action.payload.id ? { ...app, status: action.payload.status } : app
        ),
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'ADD_NOTIFICATION':
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      return {
        ...state,
        notifications: [...state.notifications, notification],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved state from localStorage on mount
  useEffect(() => {
    // Load demo data if localStorage is empty
    loadDemoData();

    // Load jobs from localStorage
    const savedJobs = EnhancedStorage.getJobs();
    if (savedJobs.length > 0) {
      dispatch({ type: 'SET_JOBS', payload: savedJobs });
    }

    const savedState = localStorage.getItem('app-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'SET_LANGUAGE', payload: parsed.language || 'en' });
        dispatch({ type: 'TOGGLE_THEME' });
        if (parsed.theme === 'dark') {
          dispatch({ type: 'TOGGLE_THEME' });
        }
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      jobs: state.jobs,
      language: state.language,
      theme: state.theme,
    };
    localStorage.setItem('app-state', JSON.stringify(stateToSave));
  }, [state.jobs, state.language, state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Custom hooks for specific state slices
export function useAuth() {
  const { state, dispatch } = useAppContext();
  
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login: (user: User) => dispatch({ type: 'LOGIN', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    updateUser: (updates: Partial<User>) => dispatch({ type: 'UPDATE_USER', payload: updates }),
  };
}

export function useJobs() {
  const { state, dispatch } = useAppContext();
  
  return {
    jobs: state.jobs,
    applications: state.applications,
    isLoading: state.isLoading,
    error: state.error,
    setJobs: (jobs: JobPost[]) => dispatch({ type: 'SET_JOBS', payload: jobs }),
    addJob: (job: JobPost) => dispatch({ type: 'ADD_JOB', payload: job }),
    updateJob: (id: string, updates: Partial<JobPost>) => 
      dispatch({ type: 'UPDATE_JOB', payload: { id, updates } }),
    deleteJob: (id: string) => dispatch({ type: 'DELETE_JOB', payload: id }),
    applyForJob: (jobId: string, seekerId: string) => 
      dispatch({ type: 'APPLY_FOR_JOB', payload: { jobId, seekerId } }),
    updateApplication: (id: string, status: Application['status']) => 
      dispatch({ type: 'UPDATE_APPLICATION', payload: { id, status } }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
  };
}

export function useUI() {
  const { state, dispatch } = useAppContext();
  
  return {
    theme: state.theme,
    language: state.language,
    notifications: state.notifications,
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    setLanguage: (lang: 'en' | 'ms') => dispatch({ type: 'SET_LANGUAGE', payload: lang }),
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => 
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
    clearNotifications: () => dispatch({ type: 'CLEAR_NOTIFICATIONS' }),
  };
}