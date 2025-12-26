import React, { useState, useEffect } from 'react';

const ProfileScreen = () => {
  const [showStats, setShowStats] = useState(false);

  // Add CSS animation for slideIn effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { 
          opacity: 0; 
          transform: translateY(-10px); 
          maxHeight: 0;
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
          maxHeight: 200px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const styles = {
    container: {
      background: 'linear-gradient(135deg, var(--tg-theme-bg-color, #17212b) 0%, rgba(23, 33, 43, 0.95) 100%)',
      minHeight: '100vh',
      padding: '16px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '16px',
      padding: '20px 0'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid var(--tg-theme-button-color, #5288c1)',
      boxShadow: '0 8px 24px rgba(82, 136, 193, 0.3)'
    },
    userName: {
      fontSize: '24px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--tg-theme-text-color, #ffffff), var(--tg-theme-accent-text-color, #64b5ef))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      cursor: 'pointer',
      padding: '8px 16px',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      position: 'relative'
    },
    userStats: {
      display: 'flex',
      gap: '24px',
      justifyContent: 'center',
      marginBottom: '16px'
    },
    userStatsExtended: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    statItem: {
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'var(--tg-theme-accent-text-color, #64b5ef)',
      display: 'block'
    },
    statLabel: {
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)',
      marginTop: '4px'
    },
    menuSection: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: 'transparent'
    },
    menuItemContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    menuIcon: {
      fontSize: '20px'
    },
    menuLabel: {
      fontSize: '16px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontWeight: '500'
    },
    menuArrow: {
      fontSize: '24px',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontWeight: '300'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <img 
            src="https://i.pravatar.cc/100?img=50"
            alt="Никита"
            style={styles.avatar}
          />
          <div 
            style={styles.userName}
            onClick={() => setShowStats(!showStats)}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(100, 181, 239, 0.1)';
              e.target.style.WebkitTextFillColor = 'var(--tg-theme-text-color, #ffffff)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.WebkitTextFillColor = 'transparent';
            }}
          >
            Никита 
            <span style={{
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color, #708499)',
              marginLeft: '8px',
              transform: showStats ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              display: 'inline-block'
            }}>▼</span>
          </div>
          {showStats && (
            <div style={{
              animation: 'slideIn 0.3s ease-out',
              overflow: 'hidden'
            }}>
              <div style={styles.userStats}>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>12</span>
                  <div style={styles.statLabel}>ПОЕЗДОК</div>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>4.8</span>
                  <div style={styles.statLabel}>РЕЙТИНГ</div>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>47</span>
                  <div style={styles.statLabel}>ОТЗЫВОВ</div>
                </div>
              </div>
              <div style={styles.userStatsExtended}>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>24</span>
                  <div style={styles.statLabel}>ПОСЫЛОК</div>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>98%</span>
                  <div style={styles.statLabel}>УСПЕШНОСТЬ</div>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>₽15k</span>
                  <div style={styles.statLabel}>ЗАРАБОТАНО</div>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>3.2</span>
                  <div style={styles.statLabel}>ГОДА С НАМИ</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.menuSection}>
        <div style={styles.menuItem} onClick={() => alert('Отзывы и рейтинг')}>
          <div style={styles.menuItemContent}>
            <span style={styles.menuIcon}>⭐</span>
            <span style={styles.menuLabel}>Отзывы и рейтинг</span>
          </div>
          <span style={styles.menuArrow}>›</span>
        </div>

        <div style={styles.menuItem} onClick={() => alert('Настройки уведомлений')}>
          <div style={styles.menuItemContent}>
            <span style={styles.menuIcon}>🔔</span>
            <span style={styles.menuLabel}>Уведомления</span>
          </div>
          <span style={styles.menuArrow}>›</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;