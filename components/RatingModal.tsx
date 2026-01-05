import React, { useState } from 'react';
import { Application, User } from '../types';
import { getString } from '../src/constants/i18n';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface RatingModalProps {
  application: Application;
  currentUser: User;
  jobSeeker: User;
  employer: User;
  onSubmitRating: (applicationId: string, rating: number, feedback: string, isEmployerRating: boolean) => void;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  application,
  currentUser,
  jobSeeker,
  employer,
  onSubmitRating,
  onClose
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const isEmployer = currentUser.role === 'EMPLOYER';
  const isRatingComplete = isEmployer ? application.employerRating : application.studentRating;
  const userBeingRated = isEmployer ? jobSeeker : employer;
  const title = isEmployer ? getString('rate_student') : getString('rate_employer');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmitRating(application.id, rating, feedback, isEmployer);
    onClose();
  };

  if (isRatingComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{getString('already_rated')}</h3>
          <p className="text-gray-600 mb-6">
            {getString('rating_submitted')}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            {getString('close')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={userBeingRated.avatar || getUIAvatar(`${userBeingRated.firstName} ${userBeingRated.lastName}`, 40)}
              alt={userBeingRated.firstName}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getUIAvatar(`${userBeingRated.firstName} ${userBeingRated.lastName}`, 40);
              }}
            />
            <div>
              <p className="font-semibold text-gray-900">
                {userBeingRated.firstName} {userBeingRated.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {isEmployer ? getString('student') : getString('employer')}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getString('your_rating')}
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="text-3xl transition-all transform hover:scale-110"
              >
                <span className={`${star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {rating === 1 && getString('poor')}
              {rating === 2 && getString('fair')}
              {rating === 3 && getString('good')}
              {rating === 4 && getString('very_good')}
              {rating === 5 && getString('excellent')}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getString('feedback')} ({getString('optional')})
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder={getString('share_your_experience')}
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            {getString('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
          >
            {getString('submit_rating')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;

/* === JOB WORKFLOW APPENDED BLOCK: RATING_HELPER === */


// Ensure rating submission persists via dbAdapter
import dbService from '../src/services/dbAdapter';

const submitRatingToDb = async (payload: any) => {
  await dbService.createRating({
    jobId: payload.jobId,
    fromUserId: payload.fromUserId,
    toUserId: payload.toUserId,
    score: payload.score,
    comment: payload.comment,
    createdAt: new Date().toISOString(),
  });
};

