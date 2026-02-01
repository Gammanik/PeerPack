import React from 'react';
import TripsSection from '../profile/components/TripsSection.jsx';

const TripsScreen = ({ onNavigate }) => {
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
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>✈️ Мои поездки</div>
        <div style={styles.subtitle}>Управляйте поездками и заявками на доставку</div>
      </div>

      <TripsSection onNavigate={onNavigate} />
    </div>
  );
};

export default TripsScreen;
