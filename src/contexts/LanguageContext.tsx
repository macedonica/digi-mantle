import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'mk' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (mk: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('mk');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'mk' ? 'en' : 'mk');
  };

  const t = (mk: string, en: string) => {
    return language === 'mk' ? mk : en;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
