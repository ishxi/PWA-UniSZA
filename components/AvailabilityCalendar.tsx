
import React, { useState, useEffect } from 'react';
import { getString } from '../src/constants/i18n';
import { SlotState } from '../types';

interface CalendarProps {
  availability: Record<string, Record<string, SlotState>>; // day -> { hour -> SlotState }
  onUpdate?: (day: string, hour: string, state: SlotState) => void;
  readOnly?: boolean;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

const AvailabilityCalendar: React.FC<CalendarProps> = ({ availability, onUpdate, readOnly = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeState, setActiveState] = useState<SlotState>('AVAILABLE');

  const handleMouseDown = (day: string, hour: string) => {
    if (readOnly || !onUpdate) return;
    setIsDragging(true);
    onUpdate(day, hour, activeState);
  };

  const handleMouseEnter = (day: string, hour: string) => {
    if (isDragging && onUpdate && !readOnly) {
      onUpdate(day, hour, activeState);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const getStateStyles = (state?: SlotState) => {
    switch (state) {
      case 'AVAILABLE': return 'bg-green-500 text-white shadow-lg shadow-green-200';
      case 'MAYBE': return 'bg-amber-400 text-white shadow-lg shadow-amber-100';
      case 'BUSY': return 'bg-rose-500 text-white shadow-lg shadow-rose-100';
      case 'EMPTY': return 'bg-slate-50 text-slate-200';
      default: return 'bg-slate-50 text-slate-200';
    }
  };

  const getStateText = (state?: SlotState) => {
    switch (state) {
      case 'AVAILABLE': return getString('available').substring(0, 1);
      case 'MAYBE': return getString('maybe').substring(0, 1);
      case 'BUSY': return getString('busy').substring(0, 1);
      default: return '';
    }
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 select-none">
      {!readOnly && (
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-purple-50 shadow-xl">
          <div className="flex-grow w-full space-y-1 text-left">
             <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{getString('selection_mode')}</p>
             <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
               {(['AVAILABLE', 'MAYBE', 'BUSY', 'EMPTY'] as SlotState[]).map(s => (
                 <button 
                  key={s} 
                  onClick={() => setActiveState(s)} 
                  className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeState === s ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-purple-600'}`}
                 >
                   {getString(s.toLowerCase() as any)}
                 </button>
               ))}
             </div>
          </div>
          <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-purple-50 rounded-2xl border border-purple-100 max-w-xs text-left">
            <span className="text-xl">✨</span>
            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest leading-relaxed">
              {getString('tap_instruction')}
            </p>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto rounded-[1.5rem] md:rounded-[3rem] border border-purple-50 shadow-2xl bg-white no-scrollbar">
        <table className="w-full border-collapse min-w-[600px]">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="p-4 md:p-6 text-left font-black text-slate-400 text-[9px] md:text-[10px] uppercase border-r border-purple-50 w-20 md:w-24 sticky left-0 z-20 bg-slate-50">
                {getString('calendar')}
              </th>
              {DAYS.map(day => (
                <th key={day} className="p-4 md:p-6 text-center font-black text-slate-900 text-[9px] md:text-[10px] uppercase border-r border-purple-50">
                  {day.substring(0,3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {HOURS.map(hour => (
              <tr key={hour} className="group">
                <td className="p-4 md:p-6 font-black text-slate-300 text-[10px] md:text-xs border-r border-purple-50 bg-slate-50/20 sticky left-0 z-10">
                  {hour}
                </td>
                {DAYS.map(day => {
                  const state = availability[day]?.[hour] || 'EMPTY';
                  return (
                    <td 
                      key={day} 
                      className={`p-1 border-r border-slate-50 min-w-[70px] md:min-w-[90px] transition-colors ${readOnly ? '' : 'cursor-pointer hover:bg-purple-50/30'}`}
                      onMouseDown={() => handleMouseDown(day, hour)}
                      onMouseEnter={() => handleMouseEnter(day, hour)}
                      onTouchStart={() => handleMouseDown(day, hour)}
                    >
                      <div className={`w-full h-10 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 ${getStateStyles(state)} ${state !== 'EMPTY' ? 'scale-95' : 'group-hover:bg-white'}`}>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                          {getStateText(state)}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
