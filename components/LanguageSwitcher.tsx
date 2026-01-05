
import React, { useEffect, useState } from 'react';
import { Language } from '../src/constants/constants.base';
import { getCurrentLanguage, setCurrentLanguage } from '../src/constants/i18n';

const LanguageSwitcher: React.FC = () => {
  const [lang, setLang] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    const handler = () => setLang(getCurrentLanguage());
    window.addEventListener('ej:languageChanged', handler as EventListener);
    return () => window.removeEventListener('ej:languageChanged', handler as EventListener);
  }, []);

  const toggle = () => {
    const next: Language = lang === 'ms' ? 'en' : 'ms';
    setCurrentLanguage(next);
  };

  return (
    <button 
      onClick={toggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white border border-purple-100 rounded-full shadow-sm transition-all active:scale-95 group"
    >
      <span className="text-sm">🌐</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-purple-600">
        {lang === 'ms' ? 'Ms' : 'En'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
