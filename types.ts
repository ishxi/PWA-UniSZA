
// Consolidated project-wide types — keep simple and consistent.
export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  EMPLOYER = 'EMPLOYER',
  JOB_SEEKER = 'JOB_SEEKER',
  GUEST = 'GUEST'
}

export enum AvailabilityStatus {
  DRAFT = 'DRAFT',
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  language?: string;
  availability?: AvailabilityStatus;
  createdAt?: string;
}

export interface JobPost {
  id: string;
  title: string;
  description?: string;
  employerId: string;
  status: AvailabilityStatus | 'CLOSED';
  createdAt: string;
  dueDate?: string | null;
  location?: string;
  // Additional metadata
  tags?: string[];
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  employerId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string | null;
  // any submission payload (links, files, notes) can go into details
  details?: any;
}

export interface Rating {
  id: string;
  jobId: string;
  fromUserId: string;
  toUserId: string;
  score: number; // 1..5
  comment?: string;
  createdAt: string;
}
