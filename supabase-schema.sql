-- Supabase Database Schema for Dream Liliac PWA
-- Run this in Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'JOB_SEEKER',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar TEXT,
  bio TEXT,
  skills TEXT[],
  profile JSONB,
  employer_profile JSONB,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  employer_id TEXT NOT NULL REFERENCES users(id),
  location TEXT,
  salary_min REAL,
  salary_max REAL,
  salary_type TEXT DEFAULT 'HOURLY',
  job_type TEXT NOT NULL,
  requirements TEXT[],
  benefits TEXT[],
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  seeker_id TEXT NOT NULL REFERENCES users(id),
  employer_id TEXT NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'PENDING',
  cover_letter TEXT,
  student_rating INTEGER,
  student_feedback TEXT,
  employer_rating INTEGER,
  employer_feedback TEXT,
  rated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id TEXT PRIMARY KEY,
  from_user_id TEXT NOT NULL REFERENCES users(id),
  to_user_id TEXT NOT NULL REFERENCES users(id),
  application_id TEXT REFERENCES applications(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stats table
CREATE TABLE IF NOT EXISTS stats (
  key TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE ratings;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_seeker_id ON applications(seeker_id);
CREATE INDEX IF NOT EXISTS idx_applications_employer_id ON applications(employer_id);
CREATE INDEX IF NOT EXISTS idx_ratings_to_user_id ON ratings(to_user_id);
