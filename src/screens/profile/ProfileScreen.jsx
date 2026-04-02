import React, { useState, useEffect } from 'react';
import { useUser } from '../../shared/context/UserContext.jsx';
import { supabaseApi } from '../../services/supabaseApi.js';
import UserRating from '../../components/UserRating.jsx';

const ProfileScreen = ({ onNavigate }) => {
  const { user } = useUser();
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [stats, setStats] = useState({
    trips: 0,
    parcels: 0,
    completedDeliveries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    }
  }, [user?.id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      // Загружаем активные доставки
      const { deliveries } = await supabaseApi.getActiveDeliveriesForUser(user.id);
      setActiveDeliveries(deliveries || []);

      // Загружаем статистику
      const { trips } = await supabaseApi.getUserTrips(user.id);
      const { parcels } = await supabaseApi.getUserParcels(user.id);

      setStats({
        trips: trips?.length || 0,
        parcels: parcels?.length || 0,
        completedDeliveries: trips?.filter(t => t.status === 'completed').length || 0
      });
    } catch (err) {
      console.error('Error loading profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, var(--tg-theme-bg-color, #17212b) 0%, rgba(23, 33, 43, 0.95) 100%)',
      minHeight: '100vh',
      paddingBottom: '80px'
    },
    header: {
      background: 'linear-gradient(180deg, rgba(82, 136, 193, 0.15) 0%, transparent 100%)',
      padding: '32px 20px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    userCard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    },
    avatarContainer: {
      position: 'relative'
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid var(--tg-theme-button-color, #5288c1)',
      boxShadow: '0 12px 40px rgba(82, 136, 193, 0.4)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    verifiedBadge: {
      position: 'absolute',
      bottom: '5px',
      right: '5px',
      background: 'linear-gradient(135deg, #4BB34B, #45a049)',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      border: '3px solid var(--tg-theme-bg-color, #17212b)',
      boxShadow: '0 4px 12px rgba(75, 179, 75, 0.4)'
    },
    userName: {
      fontSize: '26px',
      fontWeight: '800',
      color: 'var(--tg-theme-text-color, #ffffff)',
      textAlign: 'center',
      marginBottom: '4px'
    },
    userHandle: {
      fontSize: '14px',
      color: 'var(--tg-theme-hint-color, #708499)',
      textAlign: 'center',
      marginBottom: '12px'
    },
    ratingContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '8px'
    },
    content: {
      padding: '20px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '24px'
    },
    statCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '16px 12px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    statIcon: {
      fontSize: '28px',
      marginBottom: '8px',
      display: 'block'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, var(--tg-theme-accent-text-color, #64b5ef), var(--tg-theme-button-color, #5288c1))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '11px',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    deliveryCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    deliveryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    deliveryTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    statusBadge: {
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    deliveryRoute: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    deliveryInfo: {
      fontSize: '13px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    menuSection: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '16px'
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
      fontSize: '22px',
      width: '28px',
      textAlign: 'center'
    },
    menuLabel: {
      fontSize: '16px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontWeight: '500'
    },
    menuBadge: {
      background: '#FF3B30',
      color: 'white',
      fontSize: '11px',
      fontWeight: '600',
      padding: '2px 8px',
      borderRadius: '10px',
      marginLeft: '8px'
    },
    menuArrow: {
      fontSize: '24px',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontWeight: '300'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: 'var(--tg-theme-hint-color, #708499)'
    }
  };

  return (
    <div style={styles.container}>
      {/* Шапка профиля */}
      <div style={styles.header}>
        <div style={styles.userCard}>
          <div style={styles.avatarContainer}>
            <img
              src={user?.avatar_url || "https://i.pravatar.cc/100?img=50"}
              alt={user?.full_name || "Пользователь"}
              style={styles.avatar}
              onClick={() => onNavigate && onNavigate('reviews', {
                userId: user?.id,
                userName: user?.full_name,
                userAvatar: user?.avatar_url,
                userRating: user?.rating,
                reviewsCount: user?.reviews_count || 0
              })}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 16px 48px rgba(82, 136, 193, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 12px 40px rgba(82, 136, 193, 0.4)';
              }}
            />
            <div style={styles.verifiedBadge}>✓</div>
          </div>

          <div>
            <div style={styles.userName}>
              {user?.full_name || "Пользователь"}
            </div>
            {user?.telegram_username && (
              <div style={styles.userHandle}>
                @{user.telegram_username}
              </div>
            )}
            <div style={styles.ratingContainer}>
              <UserRating
                rating={user?.rating}
                reviewsCount={user?.reviews_count || 0}
                size="large"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div style={styles.content}>
        {/* Статистика */}
        <h3 style={styles.sectionTitle}>
          <span>📊</span>
          <span>Статистика</span>
        </h3>
        <div style={styles.statsGrid}>
          <div
            style={styles.statCard}
            onClick={() => onNavigate && onNavigate('trip-history')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(82, 136, 193, 0.1)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--tg-theme-secondary-bg-color, #232e3c)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={styles.statIcon}>✈️</span>
            <div style={styles.statNumber}>{stats.trips}</div>
            <div style={styles.statLabel}>Поездок</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📦</span>
            <div style={styles.statNumber}>{stats.parcels}</div>
            <div style={styles.statLabel}>Посылок</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>✅</span>
            <div style={styles.statNumber}>{stats.completedDeliveries}</div>
            <div style={styles.statLabel}>Завершено</div>
          </div>
        </div>

        {/* Активные доставки */}
        {activeDeliveries.length > 0 && (
          <>
            <h3 style={styles.sectionTitle}>
              <span>🚚</span>
              <span>Активные доставки ({activeDeliveries.length})</span>
            </h3>
            {activeDeliveries.slice(0, 3).map(delivery => (
              <div
                key={delivery.id}
                style={styles.deliveryCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(82, 136, 193, 0.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--tg-theme-secondary-bg-color, #232e3c)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={styles.deliveryHeader}>
                  <div style={styles.deliveryTitle}>
                    {delivery.parcel?.title || 'Доставка'}
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    background: delivery.status === 'in_transit' ? '#FFD700' : '#4BB34B',
                    color: delivery.status === 'in_transit' ? '#1a1a1a' : 'white'
                  }}>
                    {delivery.status === 'assigned' ? 'Назначено' : 'В пути'}
                  </span>
                </div>
                <div style={styles.deliveryRoute}>
                  <span>📍</span>
                  <span>{delivery.parcel?.origin?.split(',')[0]} → {delivery.parcel?.destination?.split(',')[0]}</span>
                </div>
                <div style={styles.deliveryInfo}>
                  Роль: {delivery.userRole === 'carrier' ? 'Курьер' : 'Отправитель'}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Меню */}
        <h3 style={styles.sectionTitle}>
          <span>⚙️</span>
          <span>Настройки и информация</span>
        </h3>
        <div style={styles.menuSection}>
          <div
            style={styles.menuItem}
            onClick={() => onNavigate && onNavigate('reviews', {
              userId: user?.id,
              userName: user?.full_name,
              userAvatar: user?.avatar_url,
              userRating: user?.rating,
              reviewsCount: user?.reviews_count || 0
            })}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(100, 181, 239, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={styles.menuItemContent}>
              <span style={styles.menuIcon}>⭐</span>
              <span style={styles.menuLabel}>
                Отзывы и рейтинг
                {user?.reviews_count > 0 && (
                  <span style={styles.menuBadge}>{user.reviews_count}</span>
                )}
              </span>
            </div>
            <span style={styles.menuArrow}>›</span>
          </div>

          <div
            style={styles.menuItem}
            onClick={() => alert('Настройки уведомлений')}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(100, 181, 239, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={styles.menuItemContent}>
              <span style={styles.menuIcon}>🔔</span>
              <span style={styles.menuLabel}>Уведомления</span>
            </div>
            <span style={styles.menuArrow}>›</span>
          </div>

          <div
            style={styles.menuItem}
            onClick={() => alert('Настройки профиля')}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(100, 181, 239, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={styles.menuItemContent}>
              <span style={styles.menuIcon}>👤</span>
              <span style={styles.menuLabel}>Редактировать профиль</span>
            </div>
            <span style={styles.menuArrow}>›</span>
          </div>

          <div
            style={styles.menuItem}
            onClick={() => onNavigate && onNavigate('about', { from: 'profile' })}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(100, 181, 239, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={styles.menuItemContent}>
              <span style={styles.menuIcon}>ℹ️</span>
              <span style={styles.menuLabel}>О приложении</span>
            </div>
            <span style={styles.menuArrow}>›</span>
          </div>

          <div
            style={{...styles.menuItem, borderBottom: 'none'}}
            onClick={() => alert('Помощь и поддержка')}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(100, 181, 239, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={styles.menuItemContent}>
              <span style={styles.menuIcon}>💬</span>
              <span style={styles.menuLabel}>Помощь</span>
            </div>
            <span style={styles.menuArrow}>›</span>
          </div>
        </div>

        {/* Версия приложения */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: 'var(--tg-theme-hint-color, #708499)',
          fontSize: '13px'
        }}>
          PeerPack v1.0.0
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
