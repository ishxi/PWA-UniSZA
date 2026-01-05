
import { translations } from '../../translations';
import type { Language } from './constants.base';

const STORAGE_KEY = 'ej_lang';

// Default to 'ms' (Malay)
let currentLanguage: Language = (localStorage.getItem(STORAGE_KEY) as Language) || 'ms';

export function setCurrentLanguage(lang: Language) {
  currentLanguage = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  window.dispatchEvent(new CustomEvent('ej:languageChanged', { detail: { lang } }));
}

export function getCurrentLanguage(): Language {
  return currentLanguage;
}

export function getString(key: string): string {
  const lang = getCurrentLanguage();
  const dict = translations[lang] || translations.ms;
  // @ts-ignore - indexing by key
  return dict[key] || key;
}
