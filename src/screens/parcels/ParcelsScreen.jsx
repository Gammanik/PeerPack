import React from 'react';
import PackagesSection from '../profile/components/PackagesSection.jsx';

const ParcelsScreen = ({ onNavigate }) => {
  const styles = {
    container: {
      background: 'linear-gradient(135deg, var(--tg-theme-bg-color, #17212b) 0%, rgba(23, 33, 43, 0.95) 100%)',
      minHeight: '100vh',
      padding: '16px',
      paddingBottom: '80px' // Отступ для нижней навигации
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
      padding: '20px 0'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--tg-theme-text-color, #ffffff), var(--tg-theme-accent-text-color, #64b5ef))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '15px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    addButton: {
      width: '100%',
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      border: 'none',
      borderRadius: '16px',
      padding: '16px',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 4px 16px rgba(82, 136, 193, 0.3)',
      transition: 'all 0.3s ease'
    }
  };

  const handleAddPackage = () => {
    // Navigate to search screen to find couriers
    if (onNavigate) {
      onNavigate('search');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>📦 Мои посылки</div>
        <div style={styles.subtitle}>Управляйте своими посылками и откликами</div>
      </div>

      <button
        style={styles.addButton}
        onClick={handleAddPackage}
      >
        <span style={{ fontSize: '20px' }}>+</span>
        <span>Добавить посылку</span>
      </button>

      <PackagesSection />
    </div>
  );
};

export default ParcelsScreen;
