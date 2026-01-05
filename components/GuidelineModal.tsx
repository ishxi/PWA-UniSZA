import React from 'react';
import { User, UserRole } from '../types';
import { getString } from '../src/constants/i18n';

interface GuidelineModalProps {
  user: User;
  onClose: () => void;
}

const GuidelineModal: React.FC<GuidelineModalProps> = ({ user, onClose }) => {
  const isStudent = user.role === UserRole.JOB_SEEKER;
  const isEmployer = user.role === UserRole.EMPLOYER;

  const studentGuidelines = [
    {
      title: getString('guideline_profile_title'),
      icon: '👤',
      steps: [
        getString('guideline_student_step1'),
        getString('guideline_student_step2'),
        getString('guideline_student_step3'),
        getString('guideline_student_step4'),
      ]
    },
    {
      title: getString('guideline_applications_title'),
      icon: '📋',
      steps: [
        getString('guideline_student_app_step1'),
        getString('guideline_student_app_step2'),
        getString('guideline_student_app_step3'),
      ]
    },
    {
      title: getString('guideline_calendar_title'),
      icon: '📅',
      steps: [
        getString('guideline_student_cal_step1'),
        getString('guideline_student_cal_step2'),
        getString('guideline_student_cal_step3'),
      ]
    },
    {
      title: getString('guideline_rating_title'),
      icon: '⭐',
      steps: [
        getString('guideline_student_rate_step1'),
        getString('guideline_student_rate_step2'),
      ]
    }
  ];

  const employerGuidelines = [
    {
      title: getString('guideline_profile_title'),
      icon: '👤',
      steps: [
        getString('guideline_employer_step1'),
        getString('guideline_employer_step2'),
        getString('guideline_employer_step3'),
      ]
    },
    {
      title: getString('guideline_jobs_title'),
      icon: '💼',
      steps: [
        getString('guideline_employer_job_step1'),
        getString('guideline_employer_job_step2'),
        getString('guideline_employer_job_step3'),
        getString('guideline_employer_job_step4'),
      ]
    },
    {
      title: getString('guideline_applicants_title'),
      icon: '👥',
      steps: [
        getString('guideline_employer_app_step1'),
        getString('guideline_employer_app_step2'),
        getString('guideline_employer_app_step3'),
      ]
    },
    {
      title: getString('guideline_completion_title'),
      icon: '✅',
      steps: [
        getString('guideline_employer_complete_step1'),
        getString('guideline_employer_complete_step2'),
        getString('guideline_employer_complete_step3'),
      ]
    }
  ];

  const guidelines = isStudent ? studentGuidelines : isEmployer ? employerGuidelines : [];

  return (
    <div className="fixed inset-0 bg-purple-950/60 backdrop-blur-md z-[500] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl md:rounded-3xl shadow-xl animate-in zoom-in duration-300 my-auto text-left max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-purple-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">📖</div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {isStudent ? getString('guideline_student_title') : isEmployer ? getString('guideline_employer_title') : getString('guideline_title')}
              </h2>
              <p className="text-sm text-slate-500">{getString('guideline_subtitle')}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-xl flex-shrink-0"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">{getString('guideline_tip_title')}</h4>
                <p className="text-sm text-blue-600">{getString('guideline_tip_content')}</p>
              </div>
            </div>
          </div>

          {guidelines.map((section, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{section.icon}</span>
                <h3 className="font-bold text-slate-800">{section.title}</h3>
              </div>
              <ol className="space-y-2">
                {section.steps.map((step, stepIdx) => (
                  <li key={stepIdx} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                      {stepIdx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div>
                <h4 className="font-semibold text-green-800 mb-1">{getString('guideline_support_title')}</h4>
                <p className="text-sm text-green-600">{getString('guideline_support_content')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-purple-100 flex-shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-200 hover:bg-slate-900 transition-all"
          >
            {getString('guideline_got_it')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidelineModal;
