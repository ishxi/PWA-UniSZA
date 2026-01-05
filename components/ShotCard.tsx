
import React from 'react';
import { Shot } from '../types';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface ShotCardProps {
  shot: Shot;
  onClick: (shot: Shot) => void;
}

const ShotCard: React.FC<ShotCardProps> = ({ shot, onClick }) => {
  return (
    <div 
      className="group relative cursor-pointer"
      onClick={() => onClick(shot)}
    >
      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-50 shadow">
        <img 
          src={shot.image} 
          alt={shot.title} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center justify-between text-white">
            <span className="font-semibold truncate pr-2">{shot.title}</span>
            <div className="flex gap-2">
              <button className="p-2 bg-white/20 hover:bg-white/40 rounded-lg transition-colors backdrop-blur-sm">
                <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
              <button className="p-2 bg-white/20 hover:bg-white/40 rounded-lg transition-colors backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <img 
            src={shot.user.avatar || getUIAvatar(shot.user.name, 40)}
            alt={shot.user.name} 
            className="w-6 h-6 rounded-full border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getUIAvatar(shot.user.name, 40);
            }}
          />
          <span className="text-sm font-medium text-gray-700 hover:text-indigo-600 truncate max-w-[120px]">
            {shot.user.name}
          </span>
          {shot.user.isPro && (
            <span className="px-1 py-0.5 bg-indigo-100 text-[10px] font-bold text-indigo-600 rounded">TEAM</span>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-gray-400">
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            {shot.likes > 1000 ? `${(shot.likes/1000).toFixed(1)}k` : shot.likes}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            {shot.views > 1000 ? `${(shot.views/1000).toFixed(1)}k` : shot.views}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotCard;
