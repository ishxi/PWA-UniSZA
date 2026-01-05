import { User, UserRole, JobPost, JobStatus, Application, ApplicationStatus, Gender, JobGenderType, AvailabilityStatus } from '../types';
import { INITIAL_USERS, INITIAL_JOBS } from '../constants/constants.base';

// Convert INITIAL_USERS to ensure proper types
const DEMO_USERS: User[] = INITIAL_USERS.map(user => ({
  ...user,
  employerProfile: user.employerProfile,
  profile: user.profile
}));

// Convert INITIAL_JOBS to ensure proper types
const DEMO_JOBS: JobPost[] = INITIAL_JOBS.map(job => ({
  id: job.id,
  employerId: job.employerId,
  employerName: job.employerName,
  title: job.title,
  description: job.description,
  status: job.status || JobStatus.AVAILABLE,
  createdAt: job.createdAt,
  startDate: job.startDate,
  endDate: job.endDate,
  paymentInfo: job.paymentInfo,
  contactWhatsapp: job.contactWhatsapp,
  preferredGender: job.preferredGender || JobGenderType.OPEN,
  location: job.location,
  schedule: job.schedule,
  requirements: job.requirements
}));

// Generate sample applications based on demo data
const DEMO_APPLICATIONS: Application[] = [
  {
    id: "app-001",
    jobId: "job-0001",
    seekerId: "student-001",
    employerId: "emp-001",
    status: ApplicationStatus.PENDING,
    createdAt: "2026-01-03T10:00:00Z"
  },
  {
    id: "app-002",
    jobId: "job-0004",
    seekerId: "student-002",
    employerId: "emp-002",
    status: ApplicationStatus.PENDING,
    createdAt: "2026-01-03T11:30:00Z"
  },
  {
    id: "app-003",
    jobId: "job-0007",
    seekerId: "student-003",
    employerId: "emp-003",
    status: ApplicationStatus.PENDING,
    createdAt: "2026-01-04T09:00:00Z"
  },
  {
    id: "app-004",
    jobId: "job-0001",
    seekerId: "student-004",
    employerId: "emp-001",
    status: ApplicationStatus.APPROVED,
    createdAt: "2026-01-02T14:00:00Z",
    employerRating: 5,
    employerFeedback: "Excellent worker, very reliable!",
    ratedAt: "2026-01-15T16:00:00Z"
  },
  {
    id: "app-005",
    jobId: "job-0004",
    seekerId: "student-005",
    employerId: "emp-002",
    status: ApplicationStatus.COMPLETED,
    createdAt: "2026-01-01T10:00:00Z",
    employerRating: 4,
    employerFeedback: "Good customer service skills",
    studentRating: 5,
    studentFeedback: "Great employer, friendly environment!",
    ratedAt: "2026-01-20T12:00:00Z"
  }
];

export const loadDemoData = () => {
  if (typeof window === 'undefined') return;

  try {
    const users = DEMO_USERS;
    const jobs = DEMO_JOBS;
    const apps = DEMO_APPLICATIONS;

    const storedUsers = localStorage.getItem('ej_users');
    if (!storedUsers) {
      localStorage.setItem('ej_users', JSON.stringify(users));
      console.log(`Demo data loaded with ${users.length} users`);
    }

    const storedJobs = localStorage.getItem('ej_jobs');
    if (!storedJobs) {
      localStorage.setItem('ej_jobs', JSON.stringify(jobs));
      console.log(`Demo data loaded with ${jobs.length} jobs`);
    }

    const storedApplications = localStorage.getItem('ej_applications');
    if (!storedApplications) {
      localStorage.setItem('ej_applications', JSON.stringify(apps));
      console.log(`Demo data loaded with ${apps.length} applications`);
    }

    const storedSettings = localStorage.getItem('ej_settings');
    if (!storedSettings) {
      localStorage.setItem('ej_settings', JSON.stringify({
        appName: "Cafe's Little Helper",
        shortName: "CLH",
        version: "1.0.0",
        theme: "light",
        language: "ms",
        currency: "RM",
        timezone: "Asia/Kuala_Lumpur"
      }));
    }
  } catch (error) {
    console.error('Error loading demo data:', error);
  }
};

export const loadFullDemoData = () => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('ej_users', JSON.stringify(DEMO_USERS));
    localStorage.setItem('ej_jobs', JSON.stringify(DEMO_JOBS));
    localStorage.setItem('ej_applications', JSON.stringify(DEMO_APPLICATIONS));
    console.log('Full demo data loaded');
  } catch (error) {
    console.error('Error loading full demo data:', error);
  }
};

export const resetToMinimalData = () => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('ej_users', JSON.stringify(DEMO_USERS));
    localStorage.setItem('ej_jobs', JSON.stringify(DEMO_JOBS));
    localStorage.setItem('ej_applications', JSON.stringify(DEMO_APPLICATIONS));
    console.log('Reset to demo data');
  } catch (error) {
    console.error('Error resetting to demo data:', error);
  }
};

export const getDemoUsers = (): User[] => {
  return DEMO_USERS;
};

export const getDemoJobs = (): JobPost[] => {
  return DEMO_JOBS;
};

export const getDemoApplications = (): Application[] => {
  return DEMO_APPLICATIONS;
};

export const getDemoUserByUsername = (username: string): User | undefined => {
  return DEMO_USERS.find(user => user.username === username);
};

export const getDemoJobById = (id: string): JobPost | undefined => {
  return DEMO_JOBS.find(job => job.id === id);
};

export const getDemoApplicationById = (id: string): Application | undefined => {
  return DEMO_APPLICATIONS.find(app => app.id === id);
};

// Re-export from constants.base.ts for convenience
export const getMinimalUsers = (): User[] => {
  return DEMO_USERS;
};

export const getMinimalJobs = (): JobPost[] => {
  return DEMO_JOBS;
};
