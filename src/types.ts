
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

export enum JobStatus {
  DRAFT = 'DRAFT',
  AVAILABLE = 'AVAILABLE',
  CLOSED = 'CLOSED',
  PENDING_DELETE = 'PENDING_DELETE'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum JobGenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OPEN = 'OPEN'
}

export interface EmployerProfile {
  companyName: string;
  businessType?: string;
  bio?: string;
  averageRating?: number;
  totalRatings?: number;
  location?: string;
}

export type SlotState = 'AVAILABLE' | 'MAYBE' | 'BUSY' | 'EMPTY';

export interface JobSeekerProfile {
  major?: string;
  year?: number;
  skills?: string[];
  experience?: string;
  bio?: string;
  status?: AvailabilityStatus;
  hourlyAvailability?: Record<string, Record<string, SlotState>>; // { "Monday": { "08:00": "AVAILABLE" } }
  averageRating?: number;
  totalRatings?: number;
  gender?: Gender;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  avatar?: string;
  employerProfile?: EmployerProfile;
  profile?: JobSeekerProfile;
  language?: 'en' | 'ms';
}

export interface JobPost {
  id: string;
  employerId: string;
  employerName?: string;
  title: string;
  description: string;
  status: JobStatus;
  createdAt?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  schedule?: string;
  paymentInfo?: string;
  contactWhatsapp?: string;
  preferredGender?: JobGenderType;
  requirements?: string[];
}

export interface Rating {
  id: string;
  applicationId: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5 stars
  feedback?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  employerId?: string;
  status: ApplicationStatus;
  employerRating?: number; // 1-5 stars
  employerFeedback?: string;
  studentRating?: number; // 1-5 stars  
  studentFeedback?: string;
  ratedAt?: string;
  createdAt?: string;
}

export interface ProjectSlide {
  id: number | string;
  title: string;
  content: string[] | string;
  diagramNote?: string;
}

export enum Category {
  MOBILE = 'MOBILE',
  BRANDING = 'BRANDING',
  ILLUSTRATION = 'ILLUSTRATION',
  WEB_DESIGN = 'WEB_DESIGN',
  PRODUCT_DESIGN = 'PRODUCT_DESIGN',
  ANIMATION = 'ANIMATION',
  PRINT = 'PRINT'
}

export interface Shot {
  id: string;
  title: string;
  image: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isPro?: boolean;
  };
  likes: number;
  views: number;
  tags: string[];
  category: Category;
}
