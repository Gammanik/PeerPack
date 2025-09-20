import React from 'react';
import { useLocale } from '../contexts/LanguageContext.jsx';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLocale();

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '20px',
      padding: '2px',
      border: '0.5px solid var(--tg-theme-hint-color, #708499)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    option: {
      padding: '6px 10px',
      borderRadius: '18px',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      userSelect: 'none',
      minWidth: '24px',
      textAlign: 'center'
    },
    active: {
      background: 'var(--tg-theme-button-color, #5288c1)',
      color: 'var(--tg-theme-button-text-color, #ffffff)',
      transform: 'scale(1.05)'
    },
    inactive: {
      background: 'transparent',
      color: 'var(--tg-theme-hint-color, #708499)'
    }
  };

  return (
    <div style={styles.container} onClick={toggleLanguage}>
      <div style={{
        ...styles.option,
        ...(language === 'ru' ? styles.active : styles.inactive)
      }}>
        RU
      </div>
      <div style={{
        ...styles.option,
        ...(language === 'en' ? styles.active : styles.inactive)
      }}>
        EN
      </div>
    </div>
  );
};

export default LanguageToggle;