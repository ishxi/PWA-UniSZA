
// Local dbAdapter for prototype using localStorage.
// Exposes methods similar to a simple backend:
// listJobs, createJob, updateJob, getJob, listApplications, createApplication, updateApplication,
// listRatings, createRating, subscribeJobs, subscribeApplications
import { JobPost, Application, Rating, User } from '../../types';

const STORAGE_PREFIX = "clh_v1_";

function key(table: string) { return STORAGE_PREFIX + table; }
function readTable(table: string) {
  try {
    const v = localStorage.getItem(key(table));
    return v ? JSON.parse(v) : [];
  } catch (e) {
    return [];
  }
}
function writeTable(table: string, data: any[]) {
  localStorage.setItem(key(table), JSON.stringify(data));
}

function ensureInitialData() {
  if (!localStorage.getItem(key('jobs'))) {
    writeTable('jobs', []);
  }
  if (!localStorage.getItem(key('applications'))) {
    writeTable('applications', []);
  }
  if (!localStorage.getItem(key('ratings'))) {
    writeTable('ratings', []);
  }
  if (!localStorage.getItem(key('users'))) {
    writeTable('users', []);
  }
}

ensureInitialData();

function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

const dbAdapter = {
  // Jobs
  async listJobs(): Promise<JobPost[]> {
    return readTable('jobs');
  },
  async getJob(id: string): Promise<JobPost | null> {
    const rows = readTable('jobs') as JobPost[];
    return rows.find(r => r.id === id) || null;
  },
  async createJob(job: Partial<JobPost>): Promise<JobPost> {
    const rows = readTable('jobs') as JobPost[];
    const newJob: JobPost = {
      id: job.id || id(),
      title: job.title || 'Untitled Job',
      description: job.description || '',
      employerId: job.employerId || 'unknown',
      status: (job.status as any) || 'AVAILABLE',
      createdAt: job.createdAt || new Date().toISOString(),
      dueDate: job.dueDate || null,
      location: job.location || '',
      tags: job.tags || []
    };
    rows.push(newJob);
    writeTable('jobs', rows);
    return newJob;
  },
  async updateJob(idStr: string, patch: Partial<JobPost>): Promise<JobPost | null> {
    const rows = readTable('jobs') as JobPost[];
    const idx = rows.findIndex(r => r.id === idStr);
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch };
    writeTable('jobs', rows);
    return rows[idx];
  },

  // Applications
  async listApplications(): Promise<Application[]> {
    return readTable('applications');
  },
  async listApplicationsByJob(jobId: string): Promise<Application[]> {
    const rows = readTable('applications') as Application[];
    return rows.filter(r => r.jobId === jobId);
  },
  async createApplication(app: Partial<Application>): Promise<Application> {
    const rows = readTable('applications') as Application[];
    const newApp: Application = {
      id: app.id || id(),
      jobId: app.jobId || '',
      seekerId: app.seekerId || '',
      employerId: app.employerId || '',
      status: (app.status as any) || 'PENDING',
      createdAt: app.createdAt || new Date().toISOString(),
      updatedAt: app.updatedAt,
      submittedAt: app.submittedAt || null,
      details: app.details || {}
    };
    rows.push(newApp);
    writeTable('applications', rows);
    return newApp;
  },
  async updateApplication(idStr: string, patch: Partial<Application>): Promise<Application | null> {
    const rows = readTable('applications') as Application[];
    const idx = rows.findIndex(r => r.id === idStr);
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch, updatedAt: new Date().toISOString() };
    writeTable('applications', rows);
    return rows[idx];
  },

  // Ratings
  async listRatings(): Promise<Rating[]> {
    return readTable('ratings');
  },
  async createRating(rating: Partial<Rating>): Promise<Rating> {
    const rows = readTable('ratings') as Rating[];
    const newRating: Rating = {
      id: rating.id || id(),
      jobId: rating.jobId || '',
      fromUserId: rating.fromUserId || '',
      toUserId: rating.toUserId || '',
      score: rating.score || 5,
      comment: rating.comment || '',
      createdAt: rating.createdAt || new Date().toISOString()
    };
    rows.push(newRating);
    writeTable('ratings', rows);
    return newRating;
  },

  // Simple subscriptions via polling
  subscribeJobs(cb: (rows: JobPost[]) => void, pollingMs = 2000) {
    let stopped = false;
    const tick = async () => { if (stopped) return; const rows = readTable('jobs') as JobPost[]; cb(rows); setTimeout(tick, pollingMs); };
    tick();
    return () => { stopped = true; };
  },
  subscribeApplications(cb: (rows: Application[]) => void, pollingMs = 2000) {
    let stopped = false;
    const tick = async () => { if (stopped) return; const rows = readTable('applications') as Application[]; cb(rows); setTimeout(tick, pollingMs); };
    tick();
    return () => { stopped = true; };
  },

  // low-level direct access (for debugging)
  _localRead: readTable,
  _localWrite: writeTable
};

export default dbAdapter;
