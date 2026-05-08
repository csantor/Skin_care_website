import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-on-surface/5 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-sm">
      <button
        onClick={() => toggleLanguage('en')}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${language === 'en'
          ? 'bg-white text-primary shadow-md scale-105'
          : 'text-on-surface-variant/60 hover:text-primary hover:bg-white/20'
          }`}
        title="English"
      >
        <span className="text-sm">EN</span>
        {language === 'en' && (
          <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"></span>
        )}
      </button>
      <button
        onClick={() => toggleLanguage('el')}
        className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${language === 'el'
          ? 'bg-white text-primary shadow-md scale-105'
          : 'text-on-surface-variant/60 hover:text-primary hover:bg-white/20'
          }`}
        title="Ελληνικά"
      >
        <span className="text-sm">GR</span>
        {language === 'el' && (
          <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
