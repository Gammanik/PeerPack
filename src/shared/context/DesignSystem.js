// Design System - centralized theme and styling tokens
export const theme = {
  colors: {
    bg: 'var(--tg-theme-bg-color, #17212b)',
    secondaryBg: 'var(--tg-theme-secondary-bg-color, #232e3c)',
    text: 'var(--tg-theme-text-color, #ffffff)',
    hint: 'var(--tg-theme-hint-color, #708499)',
    button: 'var(--tg-theme-button-color, #5288c1)',
    buttonText: 'var(--tg-theme-button-text-color, #ffffff)',
    accent: 'var(--tg-theme-accent-text-color, #64b5ef)',
    link: 'var(--tg-theme-link-color, #64b5ef)',
    success: '#4BB34B',
    danger: '#FF3333',
    warning: '#FFD700'
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    round: '50%'
  },
  
  fontSize: {
    xs: 12,
    sm: 13,
    md: 14,
    lg: 15,
    xl: 16,
    xxl: 18,
    heading: 20
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease'
  },
  
  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.1)',
    md: '0 4px 16px rgba(0,0,0,0.15)',
    lg: '0 8px 32px rgba(0,0,0,0.2)'
  },
  
  zIndex: {
    modal: 1000,
    header: 100,
    dropdown: 50
  }
};

// Common component styles
export const componentStyles = {
  button: {
    primary: {
      backgroundColor: theme.colors.button,
      color: theme.colors.buttonText,
      border: 'none',
      borderRadius: theme.borderRadius.sm,
      padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.medium,
      cursor: 'pointer',
      transition: theme.transitions.fast
    },
    
    secondary: {
      backgroundColor: 'transparent',
      color: theme.colors.link,
      border: 'none',
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.medium,
      cursor: 'pointer',
      transition: theme.transitions.fast
    }
  },
  
  card: {
    backgroundColor: theme.colors.secondaryBg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    border: `0.5px solid ${theme.colors.hint}`,
    transition: theme.transitions.fast
  },
  
  input: {
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    backgroundColor: theme.colors.bg,
    border: `0.5px solid ${theme.colors.hint}`,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    outline: 'none',
    transition: theme.transitions.fast
  }
};

// Layout styles
export const layoutStyles = {
  page: {
    minHeight: '100vh',
    background: theme.colors.bg,
    color: theme.colors.text,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `0 ${theme.spacing.md}px`,
    position: 'relative'
  },
  
  container: {
    width: '100%',
    maxWidth: 480,
    margin: '0 auto'
  }
};