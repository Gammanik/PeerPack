import React, { useState, useEffect } from 'react';
import { useAppContext } from '../shared/context/AppContext.jsx';
import { theme, layoutStyles } from '../shared/context/DesignSystem';

const NotificationsPage = () => {
  const { navigateTo } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку уведомлений
    setTimeout(() => {
      const mockNotifications = [
        {
          id: "notif_001",
          type: "package_request_response",
          title: "Запрос принят!",
          message: "Анастасия приняла ваш запрос на доставку документов",
          timestamp: "2025-08-11T14:30:00Z",
          is_read: false,
          courier_name: "Анастасия",
          package_description: "Документы в папке"
        },
        {
          id: "notif_002", 
          type: "package_delivered",
          title: "Доставка завершена",
          message: "Максим доставил ваши документы. Пожалуйста, оцените курьера",
          timestamp: "2025-08-11T12:15:00Z",
          is_read: false,
          courier_name: "Максим",
          package_description: "Документы для банка"
        },
        {
          id: "notif_003",
          type: "new_courier_available", 
          title: "Новый курьер на вашем маршруте",
          message: "Елена добавила поездку Москва → Санкт-Петербург на завтра",
          timestamp: "2025-08-11T09:45:00Z",
          is_read: false,
          courier_name: "Елена",
          route: "Москва → Санкт-Петербург",
          date: "2025-08-12"
        },
        {
          id: "notif_004",
          type: "package_request_declined",
          title: "Запрос отклонён",
          message: "Дмитрий отклонил ваш запрос: превышен лимит веса",
          timestamp: "2025-08-10T16:20:00Z",
          is_read: false,
          courier_name: "Дмитрий", 
          package_description: "Запчасти для компьютера",
          decline_reason: "Превышен лимит веса для ручной клади"
        },
        {
          id: "notif_005",
          type: "trip_request_received",
          title: "Новый запрос на доставку",
          message: "Игорь хочет отправить посылку на вашем маршруте за 600₽",
          timestamp: "2025-08-10T11:30:00Z",
          is_read: false,
          sender_name: "Игорь Смирнов",
          package_description: "Маленькая коробка с сувенирами",
          reward: 600
        },
        {
          id: "notif_006",
          type: "payment_received",
          title: "Получена оплата",
          message: "На ваш счёт поступила оплата за доставку: 800₽",
          timestamp: "2025-08-10T08:15:00Z",
          is_read: false,
          amount: 800,
          transaction_id: "tx_001"
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
      setLoading(false);
    }, 500);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, is_read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, is_read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'package_request_response': return '✅';
      case 'package_delivered': return '📦';
      case 'new_courier_available': return '🚀';
      case 'package_request_declined': return '❌';
      case 'trip_request_received': return '💰';
      case 'payment_received': return '💳';
      default: return '📢';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} дн. назад`;
    if (diffHours > 0) return `${diffHours} ч. назад`;
    return 'Только что';
  };

  const styles = {
    header: {
      position: 'sticky',
      top: 0,
      background: theme.colors.bg,
      zIndex: theme.zIndex.header,
      padding: `${theme.spacing.md}px ${theme.spacing.md}px ${theme.spacing.sm}px`,
      borderBottom: `0.5px solid ${theme.colors.hint}20`
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    backButton: {
      background: 'transparent',
      border: 'none',
      color: theme.colors.link,
      fontSize: theme.fontSize.xl,
      cursor: 'pointer',
      padding: theme.spacing.xs
    },
    title: {
      fontSize: theme.fontSize.heading,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      margin: 0
    },
    markAllButton: {
      background: 'transparent',
      border: 'none',
      color: theme.colors.link,
      fontSize: theme.fontSize.sm,
      cursor: 'pointer',
      padding: theme.spacing.xs
    },
    content: {
      padding: `0 ${theme.spacing.md}px`
    },
    unreadCounter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      background: theme.colors.secondaryBg,
      borderRadius: theme.borderRadius.md,
      margin: `${theme.spacing.md}px 0`
    },
    notificationCard: {
      background: theme.colors.secondaryBg,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      cursor: 'pointer',
      transition: theme.transitions.fast,
      border: '1px solid transparent'
    },
    unreadCard: {
      borderColor: theme.colors.button + '40',
      background: theme.colors.button + '10'
    },
    notificationHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xs
    },
    notificationIcon: {
      fontSize: theme.fontSize.xl,
      lineHeight: 1
    },
    notificationContent: {
      flex: 1
    },
    notificationTitle: {
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      margin: 0,
      marginBottom: 2
    },
    notificationMessage: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.hint,
      margin: 0,
      lineHeight: 1.4
    },
    notificationTime: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.hint,
      marginTop: theme.spacing.xs
    },
    unreadBadge: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.round,
      background: theme.colors.button,
      marginTop: 4
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: theme.colors.hint
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: theme.spacing.md
    },
    emptyText: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.medium
    }
  };

  if (loading) {
    return (
      <div style={layoutStyles.page}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          gap: theme.spacing.md
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: `3px solid ${theme.colors.hint}`,
            borderTop: `3px solid ${theme.colors.button}`,
            borderRadius: theme.borderRadius.round,
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            color: theme.colors.hint,
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.medium
          }}>
            Загрузка уведомлений...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={layoutStyles.page}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button 
            style={styles.backButton}
            onClick={() => navigateTo('profile')}
          >
            ←
          </button>
          <h1 style={styles.title}>Уведомления</h1>
          {unreadCount > 0 && (
            <button 
              style={styles.markAllButton}
              onClick={markAllAsRead}
            >
              Прочитать все
            </button>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {unreadCount > 0 && (
          <div style={styles.unreadCounter}>
            <span style={{ color: theme.colors.text, fontWeight: theme.fontWeight.medium }}>
              Непрочитанных: {unreadCount}
            </span>
          </div>
        )}

        {notifications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔔</div>
            <div style={styles.emptyText}>Уведомлений пока нет</div>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                ...styles.notificationCard,
                ...(notification.is_read ? {} : styles.unreadCard)
              }}
              onClick={() => markAsRead(notification.id)}
            >
              <div style={styles.notificationHeader}>
                <div style={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div style={styles.notificationContent}>
                  <h3 style={styles.notificationTitle}>
                    {notification.title}
                  </h3>
                  <p style={styles.notificationMessage}>
                    {notification.message}
                  </p>
                  <div style={styles.notificationTime}>
                    {getTimeAgo(notification.timestamp)}
                  </div>
                </div>
                {!notification.is_read && (
                  <div style={styles.unreadBadge}></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;