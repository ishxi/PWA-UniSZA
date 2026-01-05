// src/components/LanguageSwitcher.tsx
import React, { useEffect, useState } from 'react';
import { Language } from '../constants/constants.base';
import { getCurrentLanguage, setCurrentLanguage } from '../constants/i18n';

export const LanguageSwitcher: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    const handler = (e: any) => setCurrentLang(getCurrentLanguage());
    window.addEventListener('ej:languageChanged', handler as EventListener);
    return () => window.removeEventListener('ej:languageChanged', handler as EventListener);
  }, []);

  const toggleLanguage = () => {
    const newLang: Language = currentLang === 'en' ? 'ms' : 'en';
    setCurrentLang(newLang);
    setCurrentLanguage(newLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      style={{
        padding: '8px 16px',
        background: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        marginLeft: '10px'
      }}
    >
      {currentLang === 'en' ? '🇲🇾 BM' : '🇬🇧 EN'}
    </button>
  );
};