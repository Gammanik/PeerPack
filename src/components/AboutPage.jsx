import React, { useMemo } from 'react';
import { useAnimatedStats } from '../hooks/useAnimatedStats.js';

const AboutPage = ({ onNavigate, onBack }) => {
  const targetStats = useMemo(() => ({
    users: 2847,
    deliveries: 12459,
    rating: 4.9,
    success: 98
  }), []);

  const animatedStats = useAnimatedStats(targetStats);
  const styles = {
    container: {
      padding: '20px',
      textAlign: 'center'
    },
    header: {
      marginBottom: '32px'
    },
    logo: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      margin: '0 auto 16px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '16px',
      color: 'var(--tg-theme-hint-color, #708499)',
      marginBottom: '24px'
    },
    description: {
      fontSize: '15px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      lineHeight: 1.5,
      marginBottom: '32px'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '32px'
    },
    statCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--tg-theme-accent-text-color, #64b5ef), var(--tg-theme-button-color, #5288c1))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '4px',
      minHeight: '29px'
    },
    statLabel: {
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    features: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '32px'
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '12px',
      border: '0.5px solid var(--tg-theme-hint-color, #708499)'
    },
    featureIcon: {
      fontSize: '20px'
    },
    featureText: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontWeight: '500'
    },
    backButton: {
      background: 'var(--tg-theme-button-color, #5288c1)',
      color: 'var(--tg-theme-button-text-color, #ffffff)',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'opacity 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>📦</div>
        <div style={styles.title}>PeerPack</div>
        <div style={styles.subtitle}>P2P курьерская доставка</div>
      </div>

      <div style={styles.description}>
        Соединяем людей для удобной и выгодной доставки. 
        Найдите курьера среди путешественников или заработайте на своих поездках.
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {animatedStats.users != null ? animatedStats.users.toLocaleString() : ''}
          </div>
          <div style={styles.statLabel}>Пользователей</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {animatedStats.deliveries != null ? animatedStats.deliveries.toLocaleString() : ''}
          </div>
          <div style={styles.statLabel}>Доставок</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {animatedStats.rating != null ? animatedStats.rating : ''}
          </div>
          <div style={styles.statLabel}>Рейтинг</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {animatedStats.success != null ? `${animatedStats.success}%` : ''}
          </div>
          <div style={styles.statLabel}>Успешность</div>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🔍</div>
          <div style={styles.featureText}>Найдите курьера для доставки</div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>✈️</div>
          <div style={styles.featureText}>Заработайте на своих поездках</div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>💰</div>
          <div style={styles.featureText}>Выгодные цены для всех</div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🔒</div>
          <div style={styles.featureText}>Безопасно через Telegram</div>
        </div>
      </div>

      <button
        style={styles.backButton}
        onClick={onBack || (() => onNavigate('profile'))}
      >
        ← Назад
      </button>
    </div>
  );
};

export default AboutPage;