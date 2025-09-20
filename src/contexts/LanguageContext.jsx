import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations.js';

const STORAGE_KEY = 'peerpack_language';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const getInitialLanguage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'ru' || saved === 'en')) {
      return saved;
    }
    return 'ru';
  };

  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        break;
      }
    }
    
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ru' ? 'en' : 'ru');
  };

  const getCities = () => {
    return Object.keys(translations[language].cities).map(englishName => ({
      english: englishName,
      local: translations[language].cities[englishName]
    }));
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    getCities,
    isRussian: language === 'ru',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLocale must be used within a LanguageProvider');
  }
  return context;
};