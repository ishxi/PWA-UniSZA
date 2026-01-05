import { User, JobPost, Application, SlotState } from '../types';
import { loadDemoData, getDemoUsers, getDemoJobs, getDemoApplications } from './demoDataService';

// Storage configuration based on data characteristics
export const STORAGE_CONFIG = {
  // localStorage: Persistent data (survives browser restart)
  persistent: {
    users: { key: 'ej_users', type: 'localStorage' },
    jobs: { key: 'ej_jobs', type: 'localStorage' },
    applications: { key: 'ej_applications', type: 'localStorage' },
    settings: { key: 'ej_settings', type: 'localStorage' },
    theme: { key: 'ej_theme', type: 'localStorage' },
    language: { key: 'ej_language', type: 'localStorage' }
  },
  
  // sessionStorage: Temporary session data (cleared on tab close)
  session: {
    currentTab: { key: 'ej_current_tab', type: 'sessionStorage' },
    formData: { key: 'ej_form_data', type: 'sessionStorage' },
    searchHistory: { key: 'ej_search_history', type: 'sessionStorage' },
    filterState: { key: 'ej_filters', type: 'sessionStorage' },
    selectedItems: { key: 'ej_selected', type: 'sessionStorage' }
  },
  
  // cookies: Small authentication and preference data
  cookies: {
    authToken: { key: 'ej_auth_token', days: 7 },
    rememberMe: { key: 'ej_remember', days: 30 },
    userPreferences: { key: 'ej_prefs', days: 90 }
  }
} as const;

type StorageKey = keyof typeof STORAGE_CONFIG.persistent | 
                  keyof typeof STORAGE_CONFIG.session | 
                  keyof typeof STORAGE_CONFIG.cookies;

export class EnhancedStorage {
  // localStorage operations
  static setPersistent<T>(key: keyof typeof STORAGE_CONFIG.persistent, data: T): void {
    try {
      const config = STORAGE_CONFIG.persistent[key];
      const compressed = this.compressData(data);
      localStorage.setItem(config.key, compressed);
    } catch (error) {
      console.error(`Failed to save persistent data for ${key}:`, error);
      this.handleStorageError(key);
    }
  }

  static getPersistent<T>(key: keyof typeof STORAGE_CONFIG.persistent): T | null {
    try {
      const config = STORAGE_CONFIG.persistent[key];
      const data = localStorage.getItem(config.key);
      return data ? this.decompressData(data) : null;
    } catch (error) {
      console.error(`Failed to load persistent data for ${key}:`, error);
      return null;
    }
  }

  // sessionStorage operations
  static setSession<T>(key: keyof typeof STORAGE_CONFIG.session, data: T): void {
    try {
      const config = STORAGE_CONFIG.session[key];
      const compressed = this.compressData(data);
      sessionStorage.setItem(config.key, compressed);
    } catch (error) {
      console.error(`Failed to save session data for ${key}:`, error);
    }
  }

  static getSession<T>(key: keyof typeof STORAGE_CONFIG.session): T | null {
    try {
      const config = STORAGE_CONFIG.session[key];
      const data = sessionStorage.getItem(config.key);
      return data ? this.decompressData(data) : null;
    } catch (error) {
      console.error(`Failed to load session data for ${key}:`, error);
      return null;
    }
  }

  // Cookie operations
  static setCookie(key: keyof typeof STORAGE_CONFIG.cookies, value: string): void {
    try {
      const config = STORAGE_CONFIG.cookies[key];
      const expires = new Date();
      expires.setDate(expires.getDate() + config.days);
      document.cookie = `${config.key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    } catch (error) {
      console.error(`Failed to set cookie for ${key}:`, error);
    }
  }

  static getCookie(key: keyof typeof STORAGE_CONFIG.cookies): string | null {
    try {
      const config = STORAGE_CONFIG.cookies[key];
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === config.key) {
          return decodeURIComponent(value);
        }
      }
      return null;
    } catch (error) {
      console.error(`Failed to get cookie for ${key}:`, error);
      return null;
    }
  }

  static deleteCookie(key: keyof typeof STORAGE_CONFIG.cookies): void {
    const config = STORAGE_CONFIG.cookies[key];
    document.cookie = `${config.key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Utility functions
  private static compressData(data: any): string {
    try {
      return JSON.stringify(data);
    } catch {
      return '';
    }
  }

  private static decompressData<T>(data: string): T | null {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private static handleStorageError(key: string): void {
    // Clear old data if storage is full
    if (key === 'users' || key === 'jobs') {
      const oldData = localStorage.getItem('ej_backup');
      if (oldData) {
        localStorage.removeItem('ej_backup');
        console.warn('Cleared backup data to free space');
      }
    }
  }

  // Data management functions
  static saveUsers(users: User[]): void {
    this.setPersistent('users', users);
  }

  static getUsers(): User[] {
    let users = this.getPersistent<User[]>('users') || [];
    
    // Load demo data if empty
    if (users.length === 0) {
      loadDemoData();
      users = this.getPersistent<User[]>('users') || [];
    }
    
    return users;
  }

  static saveJobs(jobs: JobPost[]): void {
    this.setPersistent('jobs', jobs);
  }

  static getJobs(): JobPost[] {
    let jobs = this.getPersistent<JobPost[]>('jobs') || [];
    
    // Load demo data if empty
    if (jobs.length === 0) {
      loadDemoData();
      jobs = this.getPersistent<JobPost[]>('jobs') || [];
    }
    
    return jobs;
  }

  static saveApplications(applications: Application[]): void {
    this.setPersistent('applications', applications);
  }

  static getApplications(): Application[] {
    let applications = this.getPersistent<Application[]>('applications') || [];
    
    // Load demo data if empty
    if (applications.length === 0) {
      loadDemoData();
      applications = this.getPersistent<Application[]>('applications') || [];
    }
    
    return applications;
  }

  static saveCurrentTab(tab: string): void {
    this.setSession('currentTab', tab);
  }

  static getCurrentTab(): string {
    return this.getSession<string>('currentTab') || 'metrics';
  }

  static saveFormData(formData: any): void {
    this.setSession('formData', formData);
  }

  static getFormData(): any {
    return this.getSession('formData') || {};
  }

  static saveAuthToken(token: string): void {
    this.setCookie('authToken', token);
  }

  static getAuthToken(): string | null {
    return this.getCookie('authToken');
  }

  static clearAuth(): void {
    this.deleteCookie('authToken');
    this.deleteCookie('rememberMe');
  }

  // Storage optimization
  static optimizeStorage(): void {
    try {
      // Clean up old session data
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('ej_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));

      console.log('Storage optimization completed');
    } catch (error) {
      console.error('Storage optimization failed:', error);
    }
  }

  // Export/Import functionality
  static exportData(): string {
    const data = {
      users: this.getUsers(),
      jobs: this.getJobs(),
      applications: this.getApplications(),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.users) this.saveUsers(data.users);
      if (data.jobs) this.saveJobs(data.jobs);
      if (data.applications) this.saveApplications(data.applications);
      return true;
    } catch {
      return false;
    }
  }
}

// Storage monitoring
export const useStorageMonitor = () => {
  const checkStorageUsage = () => {
    const localStorageUsed = JSON.stringify(localStorage).length;
    const sessionStorageUsed = JSON.stringify(sessionStorage).length;
    
    return {
      localStorage: {
        used: localStorageUsed,
        percentage: (localStorageUsed / (5 * 1024 * 1024)) * 100
      },
      sessionStorage: {
        used: sessionStorageUsed,
        percentage: (sessionStorageUsed / (5 * 1024 * 1024)) * 100
      }
    };
  };

  return { checkStorageUsage };
};

// Legacy functions for backward compatibility
export const loadJSON = (k:string, def:any) => {
  try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(def)); } catch { return def; }
};
export const saveJSON = (k:string, v:any) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};
