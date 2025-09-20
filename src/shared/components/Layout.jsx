import React from 'react';
import { useAppContext } from '../context/AppContext';
import { theme, layoutStyles } from '../context/DesignSystem';

const Layout = ({ children }) => {
  const { currentPage, navigateTo, searchCollapsed } = useAppContext();
  
  const styles = {
    logoContainer: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${theme.spacing.lg}px ${theme.spacing.md}px ${theme.spacing.md}px`,
      marginBottom: theme.spacing.sm
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flex: 1,
      justifyContent: 'center'
    },
    logoButton: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: theme.transitions.fast,
      padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
      borderRadius: theme.borderRadius.md
    },
    logoIcon: {
      width: 28,
      height: 28,
      background: `linear-gradient(135deg, ${theme.colors.button}, ${theme.colors.accent})`,
      borderRadius: theme.borderRadius.sm,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold
    },
    logoText: {
      fontSize: theme.fontSize.heading,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      letterSpacing: '-0.02em'
    },
    profileButton: {
      background: 'transparent',
      border: 'none',
      borderRadius: theme.borderRadius.sm,
      padding: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: theme.fontSize.xxl,
      transition: theme.transitions.fast,
      color: theme.colors.hint,
      width: 32,
      height: 32
    }
  };
  
  const showHeader = !searchCollapsed && currentPage !== 'about' && currentPage !== 'profile' && currentPage !== 'notifications';
  const showBottomNav = currentPage === 'search' || currentPage === 'profile';
  
  return (
    <div style={layoutStyles.page}>
      {/* Logo and Profile Header */}
      {showHeader && (
        <div style={styles.logoContainer}>
          <div style={{ width: 32 }}></div>
          <div style={styles.logoSection}>
            <button 
              style={styles.logoButton}
              onClick={() => navigateTo('about')}
            >
              <div style={styles.logoIcon}>📦</div>
              <span style={styles.logoText}>PeerPack</span>
            </button>
          </div>
          <button 
            style={styles.profileButton}
            onClick={() => navigateTo('profile')}
          >
            👤
          </button>
        </div>
      )}
      
      {children}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: theme.colors.secondaryBg,
          borderTop: `0.5px solid ${theme.colors.hint}40`,
          padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
          display: 'flex',
          justifyContent: 'space-around',
          zIndex: theme.zIndex.header,
          backdropFilter: 'blur(20px)'
        }}>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: currentPage === 'search' ? theme.colors.button : theme.colors.hint,
              fontSize: theme.fontSize.sm,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: theme.spacing.xs,
              fontWeight: currentPage === 'search' ? theme.fontWeight.semibold : theme.fontWeight.normal
            }}
            onClick={() => navigateTo('search')}
          >
            <span style={{ fontSize: theme.fontSize.lg }}>🔍</span>
            <span>Поиск</span>
          </button>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: currentPage === 'profile' ? theme.colors.button : theme.colors.hint,
              fontSize: theme.fontSize.sm,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: theme.spacing.xs,
              fontWeight: currentPage === 'profile' ? theme.fontWeight.semibold : theme.fontWeight.normal
            }}
            onClick={() => navigateTo('profile')}
          >
            <span style={{ fontSize: theme.fontSize.lg }}>👤</span>
            <span>Профиль</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;