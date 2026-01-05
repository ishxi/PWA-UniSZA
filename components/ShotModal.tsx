
import React, { useEffect, useState } from 'react';
import { Shot } from '../types';
import { getDesignFeedback } from '../services/mockData';
import { getUIAvatar } from '../src/utils/uiHelpers';

interface ShotModalProps {
  shot: Shot | null;
  onClose: () => void;
}

const ShotModal: React.FC<ShotModalProps> = ({ shot, onClose }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    if (shot) {
      setLoadingFeedback(true);
      getDesignFeedback(shot.title, shot.tags).then((res) => {
        setFeedback(res);
        setLoadingFeedback(false);
      });
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [shot]);

  if (!shot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-purple-950/40 backdrop-blur-md transition-all">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors text-white md:text-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Image Content */}
        <div className="flex-1 bg-purple-50 overflow-y-auto custom-scrollbar p-6 flex flex-col items-center">
            <div className="w-full mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                     <img 
                       src={shot.user.avatar || getUIAvatar(shot.user.name, 40)}
                      className="w-10 h-10 rounded-full border-2 border-purple-200"
                      alt={shot.user.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getUIAvatar(shot.user.name, 40);
                      }}
                    />
                    <div>
                        <h2 className="font-bold text-slate-900 leading-tight">{shot.title}</h2>
                        <p className="text-sm text-purple-600 font-medium">{shot.user.name}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">Save</button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">Like</button>
                </div>
            </div>
            
            <img 
                src={shot.image} 
                className="w-full rounded-2xl shadow-xl shadow-purple-100 object-contain max-h-[60vh]" 
                alt={shot.title} 
            />

            <div className="w-full mt-8 prose prose-slate">
                <p className="text-slate-600 leading-relaxed italic">
                    "This exploration focuses on creating a harmonious balance between functionality and ethereal aesthetic. The dream lilac palette aims to reduce user stress while providing a modern, clean interface."
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                    {shot.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold">#{tag}</span>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full md:w-80 bg-white border-l border-purple-50 p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Design Insight</h3>
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl relative overflow-hidden">
                    {loadingFeedback ? (
                        <div className="flex flex-col gap-2 animate-pulse">
                            <div className="h-3 bg-purple-200 rounded w-full"></div>
                            <div className="h-3 bg-purple-200 rounded w-3/4"></div>
                        </div>
                    ) : (
                        <p className="text-sm text-purple-900 leading-relaxed">
                            <span className="text-purple-400 mr-2 text-xl font-serif">“</span>
                            {feedback}
                        </p>
                    )}
                    <div className="absolute top-0 right-0 p-1 opacity-20">
                        <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col p-3 rounded-xl border border-slate-100">
                        <span className="text-xl font-bold text-slate-800">{shot.likes}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Likes</span>
                    </div>
                    <div className="flex flex-col p-3 rounded-xl border border-slate-100">
                        <span className="text-xl font-bold text-slate-800">{shot.views}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Views</span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tools Used</h3>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">Fi</div>
                    <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">Ps</div>
                    <div className="w-8 h-8 rounded bg-orange-400 flex items-center justify-center text-white text-[10px] font-bold">Ai</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShotModal;
