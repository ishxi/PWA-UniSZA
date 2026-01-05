/**
 * StudentProfileDetail Component
 * 
 * Professional full-page student profile with three sections:
 * - Profile: Personal info, bio, skills, experience, contact
 * - Availability: Weekly schedule calendar
 * - Job History: All completed jobs with ratings
 * 
 * @component
 * @param {User} user - The student user object to display
 * @param {Application[]} applications - All applications for job history
 * @param {JobPost[]} allJobs - All jobs for reference
 * @param {() => void} onClose - Callback when profile is closed
 */

import React, { useState } from 'react';
import { User, Application, JobPost, ApplicationStatus, AvailabilityStatus, SlotState } from '../types';
import { getString } from '../src/constants/i18n';
import { getUIAvatar } from '../src/utils/uiHelpers';
import AvailabilityCalendar from './AvailabilityCalendar';

interface StudentProfileDetailProps {
  user: User;
  applications: Application[];
  allJobs: JobPost[];
  onClose: () => void;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const StudentProfileDetail: React.FC<StudentProfileDetailProps> = ({ user, applications, allJobs, onClose }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'availability' | 'history'>('profile');

  const studentApplications = applications.filter(app => app.seekerId === user.id);
  const completedApplications = studentApplications.filter(app => app.status === ApplicationStatus.COMPLETED);
  const pendingApplications = studentApplications.filter(app => app.status === ApplicationStatus.PENDING);

  const completedJobs = completedApplications.map(app => {
    const job = allJobs.find(j => j.id === app.jobId);
    return { application: app, job };
  }).filter(item => item.job);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-lg',
      lg: 'text-2xl'
    };
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`${sizeClasses[size]} ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const getAvailabilityStats = () => {
    let available = 0, maybe = 0, busy = 0;
    if (user.profile?.hourlyAvailability) {
      Object.values(user.profile.hourlyAvailability).forEach(day => {
        Object.values(day).forEach(hour => {
          if (hour === 'AVAILABLE') available++;
          else if (hour === 'MAYBE') maybe++;
          else if (hour === 'BUSY') busy++;
        });
      });
    }
    return { available, maybe, busy };
  };

  const stats = getAvailabilityStats();

  const renderProfileSection = () => (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Hero Profile Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white">
        <div className="absolute inset-0 bg-[url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)] opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img 
                src={user.avatar || getUIAvatar(`${user.firstName} ${user.lastName}`, 200)}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover shadow-2xl ring-4 ring-white/10"
                alt={`${user.firstName} ${user.lastName}`}
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.firstName} {user.lastName}</h1>
              <p className="text-white/60 text-sm mb-3">@{user.username}</p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user.profile?.major && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-medium">
                    <span>🎓</span> {user.profile.major}
                  </span>
                )}
                {user.profile?.year && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-medium">
                    <span>📅</span> Tahun {user.profile.year}
                  </span>
                )}
              </div>
            </div>

            {user.profile?.averageRating && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                <div className="flex justify-center mb-1">{renderStars(user.profile.averageRating, 'md')}</div>
                <div className="text-2xl font-bold">{user.profile.averageRating.toFixed(1)}</div>
                <div className="text-xs text-white/60">{user.profile.totalRatings || 0} reviews</div>
              </div>
            )}
          </div>

          {/* Quick Contact Bar */}
          <div className="flex gap-3 mt-6 justify-center md:justify-start">
            {user.phoneNumber && (
              <a
                href={`https://wa.me/${user.phoneNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat
              </a>
            )}
            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center md:justify-start">
        {user.profile?.status === AvailabilityStatus.AVAILABLE ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Available for work
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
            Currently busy
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-xl">✨</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.available}</div>
          <div className="text-xs text-slate-500">Available Hours</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-xl">🤔</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats.maybe}</div>
          <div className="text-xs text-slate-500">Maybe Hours</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-xl">✅</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{completedJobs.length}</div>
          <div className="text-xs text-slate-500">Jobs Done</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="text-xl">⭐</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{user.profile?.averageRating?.toFixed(1) || '-'}</div>
          <div className="text-xs text-slate-500">Avg Rating</div>
        </div>
      </div>

      {/* About Section */}
      {user.profile?.bio && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm">💬</span>
            About
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">{user.profile.bio}</p>
        </div>
      )}

      {/* Skills Section */}
      {user.profile?.skills && user.profile.skills.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">✨</span>
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.profile.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {user.profile?.experience && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm">💼</span>
            Experience
          </h3>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">{user.profile.experience}</p>
          </div>
        </div>
      )}

      {/* Personal Info Grid */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm">📋</span>
          Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {user.profile?.major && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Major</p>
              <p className="text-sm font-medium text-slate-700">{user.profile.major}</p>
            </div>
          )}
          {user.profile?.year && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Year</p>
              <p className="text-sm font-medium text-slate-700">Year {user.profile.year}</p>
            </div>
          )}
          {user.gender && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Gender</p>
              <p className="text-sm font-medium text-slate-700">
                {user.gender === 'MALE' ? 'Male' : user.gender === 'FEMALE' ? 'Female' : user.gender}
              </p>
            </div>
          )}
          {user.phoneNumber && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Phone</p>
              <p className="text-sm font-medium text-slate-700">{user.phoneNumber}</p>
            </div>
          )}
          {user.email && (
            <div className="col-span-2 bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Email</p>
              <p className="text-sm font-medium text-slate-700">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAvailabilitySection = () => (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Availability Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">📅</span>
            Weekly Availability
          </h3>
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-green-500 rounded-md"></span>
              <span className="text-slate-600">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-amber-400 rounded-md"></span>
              <span className="text-slate-600">Maybe</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-rose-500 rounded-md"></span>
              <span className="text-slate-600">Busy</span>
            </div>
          </div>
        </div>
        <p className="text-slate-500 text-sm">
          {user.firstName}'s weekly schedule for part-time work. 
          Times marked as "Available" indicate when the student is ready to work.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Available', count: stats.available, color: 'green', icon: '✨' },
          { label: 'Maybe', count: stats.maybe, color: 'amber', icon: '🤔' },
          { label: 'Busy', count: stats.busy, color: 'rose', icon: '🚫' }
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className={`text-2xl font-bold text-${item.color}-600`}>{item.count}</div>
            <div className="text-xs text-slate-500">{item.label} Hours</div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-100 shadow-sm overflow-x-auto">
        {user.profile?.hourlyAvailability ? (
          <AvailabilityCalendar 
            availability={user.profile.hourlyAvailability} 
            readOnly={true}
          />
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📅</span>
            </div>
            <p className="text-slate-500 font-medium">No schedule set yet</p>
            <p className="text-slate-400 text-sm mt-1">Student hasn't configured their availability</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100">
        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <span>💡</span> Tips
        </h4>
        <p className="text-sm text-slate-600">
          Students with more "Available" hours typically respond faster to job opportunities. 
          Consider their schedule compatibility when reviewing applications.
        </p>
      </div>
    </div>
  );

  const renderJobHistorySection = () => (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Job History Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">📜</span>
            Job History
          </h3>
          <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            {completedJobs.length} completed
          </span>
        </div>
      </div>

      {/* Performance Card */}
      {completedJobs.length > 0 && user.profile?.averageRating && (
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-6 text-white">
          <h4 className="font-bold text-lg mb-5 flex items-center gap-2">
            <span>📊</span> Performance Overview
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">{renderStars(user.profile.averageRating, 'lg')}</div>
              <div className="text-2xl font-bold">{user.profile.averageRating.toFixed(1)}</div>
              <div className="text-xs text-white/60">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{completedJobs.length}</div>
              <div className="text-xs text-white/60">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{user.profile.totalRatings || 0}</div>
              <div className="text-xs text-white/60">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-green-400">100%</div>
              <div className="text-xs text-white/60">Completion Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Job History List */}
      {completedJobs.length > 0 ? (
        <div className="space-y-4">
          {completedJobs.map(({ application, job }) => (
            <div 
              key={application.id} 
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{job?.title}</h4>
                  <p className="text-sm text-slate-500">{job?.employerName}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Completed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Location</p>
                  <p className="text-sm font-medium text-slate-700">{job?.location || '-'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Payment</p>
                  <p className="text-sm font-medium text-slate-700">{job?.paymentInfo || '-'}</p>
                </div>
              </div>

              {application.employerRating && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">Employer Rating</p>
                    <div className="flex items-center gap-2">
                      {renderStars(application.employerRating, 'sm')}
                      <span className="font-bold text-amber-600">{application.employerRating.toFixed(1)}</span>
                    </div>
                  </div>
                  {application.employerFeedback && (
                    <p className="text-sm text-slate-600 italic">"{application.employerFeedback}"</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Completed: {application.ratedAt ? new Date(application.ratedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : '-'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">📭</span>
          </div>
          <h4 className="font-bold text-slate-700 text-lg mb-2">No Job History Yet</h4>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            {user.firstName} hasn't completed any jobs yet. This is a great opportunity to onboard them!
          </p>
          <div className="mt-6">
            {user.phoneNumber && (
              <a
                href={`https://wa.me/${user.phoneNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-[#25D366]/20 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Invite to Apply
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-50 z-[500] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-sm font-bold text-slate-800">Student Profile</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="sticky top-14 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-30">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'availability', label: 'Availability', icon: '📅' },
              { id: 'history', label: 'History', icon: '📜' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activeSection === section.id
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{section.icon}</span>
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-5 pb-24">
        {activeSection === 'profile' && renderProfileSection()}
        {activeSection === 'availability' && renderAvailabilitySection()}
        {activeSection === 'history' && renderJobHistorySection()}
      </div>
    </div>
  );
};

export default StudentProfileDetail;
