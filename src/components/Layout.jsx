import React, { useState } from 'react';

const Layout = ({ children, currentPage, onNavigate }) => {
  const [notificationCount] = useState(6);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'var(--tg-theme-bg-color, #17212b)',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      background: 'var(--tg-theme-bg-color, #17212b)',
      borderBottom: '0.5px solid var(--tg-theme-hint-color, #708499)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    logoIcon: {
      width: 28,
      height: 28,
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'var(--tg-theme-text-color, #ffffff)',
      letterSpacing: '-0.02em'
    },
    profileButton: {
      position: 'relative',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      cursor: 'pointer',
      fontSize: '20px',
      color: 'var(--tg-theme-hint-color, #708499)',
      transition: 'all 0.2s ease'
    },
    notificationBadge: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      background: '#FF3B30',
      color: 'white',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      fontSize: '10px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1.5px solid var(--tg-theme-bg-color, #17212b)'
    },
    bottomNav: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderTop: '0.5px solid var(--tg-theme-hint-color, #708499)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0 16px',
      zIndex: 100,
      backdropFilter: 'blur(20px)'
    },
    navButton: {
      background: 'transparent',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 20px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '500',
      borderRadius: '12px',
      transition: 'all 0.2s ease'
    },
    navIcon: {
      fontSize: '18px',
      marginBottom: '2px'
    },
    activeNavButton: {
      color: 'var(--tg-theme-button-color, #5288c1)'
    },
    inactiveNavButton: {
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    content: {
      paddingBottom: '80px',
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%'
    }
  };

  return (
    <div style={styles.container}>
      {/* Хедер */}
      <div style={styles.header}>
        <div style={styles.logo} onClick={() => onNavigate('about')}>
          <div style={styles.logoIcon}>📦</div>
          <span style={styles.logoText}>PeerPack</span>
        </div>
      </div>

      {/* Контент */}
      <div style={styles.content}>
        {children}
      </div>

      {/* Нижняя навигация */}
      <div style={styles.bottomNav}>
        <button
          style={{
            ...styles.navButton,
            ...(currentPage === 'search' ? styles.activeNavButton : styles.inactiveNavButton)
          }}
          onClick={() => onNavigate('search')}
        >
          <div style={styles.navIcon}>🔍</div>
          <div>Поиск</div>
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(currentPage === 'profile' ? styles.activeNavButton : styles.inactiveNavButton),
            position: 'relative'
          }}
          onClick={() => onNavigate('profile')}
        >
          <div style={styles.navIcon}>👤</div>
          <div>Профиль</div>
          {notificationCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '2px',
              right: '8px',
              background: '#FF3B30',
              color: 'white',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: '9px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--tg-theme-secondary-bg-color, #232e3c)'
            }}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Layout;