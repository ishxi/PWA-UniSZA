
import React from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12 sm:space-y-16 py-8 sm:py-12">
      <header className="space-y-4 sm:space-y-6 px-4">
        <h1 className="text-3xl sm:text-4xl font-black text-blue-900 leading-tight tracking-tighter">
          Cafe's <span className="text-yellow-600">Little Helper</span> Portal
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
          The ultimate bridge for students to discover part-time roles: 
          <span className="text-blue-600"> Cafe, Restaurant, Kitchen Helpers, and more.</span>
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 px-4">
        {/* Job Seeker Card */}
        <div className="bg-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-4 sm:border-b-8 border-blue-600 flex flex-col group">
          <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:rotate-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">Find Local Jobs</h2>
          <p className="text-gray-500 mb-10 text-lg flex-grow leading-relaxed">
            Register as a Seeker to apply for campus roles. Control your visibility and get contacted directly by university departments.
          </p>
          <button 
            onClick={() => onSelectRole(UserRole.JOB_SEEKER)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-blue-100 transition-all text-xl"
          >
            I'm a Student
          </button>
        </div>

        {/* Employer Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-b-8 border-yellow-600 flex flex-col group">
          <div className="h-20 w-20 bg-yellow-50 text-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:-rotate-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">Hire Student Talent</h2>
          <p className="text-gray-500 mb-10 text-lg flex-grow leading-relaxed">
            Need helpers for your cafe, restaurant, or kitchen? Browse available student profiles and hire reliable talent today.
          </p>
          <button 
            onClick={() => onSelectRole(UserRole.EMPLOYER)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-yellow-100 transition-all text-xl"
          >
            I'm an Employer
          </button>
        </div>
      </div>

      <div className="pt-12">
        <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <p className="text-sm font-bold text-gray-400">
            Official Prototype for SAD CSF12703 Coursework
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
