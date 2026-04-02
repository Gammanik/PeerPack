import React, { useState, useEffect } from 'react';
import { supabaseApi } from '../../services/supabaseApi.js';
import { useUser } from '../../shared/context/UserContext.jsx';

const TripHistoryScreen = ({ onBack }) => {
  const { user } = useUser();
  const [trips, setTrips] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    completedTrips: 0,
    totalParcels: 0,
    totalEarned: 0,
    averagePerTrip: 0
  });

  useEffect(() => {
    if (user?.id) {
      loadTripHistory();
    }
  }, [user?.id]);

  const loadTripHistory = async () => {
    try {
      setLoading(true);

      // Загружаем все поездки пользователя
      const { trips: userTrips } = await supabaseApi.getUserTrips(user.id);
      setTrips(userTrips || []);

      // Загружаем все доставки где пользователь - курьер
      const { deliveries: userDeliveries } = await supabaseApi.getUserDeliveries(user.id);
      setDeliveries(userDeliveries || []);

      // Вычисляем статистику
      const completedTrips = (userTrips || []).filter(t => t.status === 'completed');
      const deliveredParcels = (userDeliveries || []).filter(d => d.status === 'delivered');

      // Подсчет заработка (price из поездок для завершенных)
      const totalEarned = completedTrips.reduce((sum, trip) => {
        // Считаем сколько посылок было доставлено в этой поездке
        const tripDeliveries = deliveredParcels.filter(d => d.trip_id === trip.id);
        const tripEarnings = tripDeliveries.reduce((s, d) => s + (d.parcel?.reward || 0), 0);
        return sum + tripEarnings;
      }, 0);

      const avgPerTrip = completedTrips.length > 0 ? totalEarned / completedTrips.length : 0;

      setStats({
        totalTrips: userTrips?.length || 0,
        completedTrips: completedTrips.length,
        totalParcels: deliveredParcels.length,
        totalEarned,
        averagePerTrip: avgPerTrip
      });
    } catch (err) {
      console.error('Error loading trip history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCity = (location) => {
    if (!location) return '';
    return location.split(',')[0].trim();
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, var(--tg-theme-bg-color, #17212b) 0%, rgba(23, 33, 43, 0.95) 100%)',
      minHeight: '100vh',
      paddingBottom: '80px'
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      background: 'var(--tg-theme-bg-color, #17212b)',
      zIndex: 10,
      backdropFilter: 'blur(20px)'
    },
    backButton: {
      background: 'transparent',
      border: 'none',
      color: 'var(--tg-theme-link-color, #64b5ef)',
      fontSize: '16px',
      cursor: 'pointer',
      fontWeight: '500',
      padding: '8px 0',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px'
    },
    content: {
      padding: '20px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginBottom: '24px'
    },
    statCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center'
    },
    statIcon: {
      fontSize: '32px',
      marginBottom: '8px',
      display: 'block'
    },
    statNumber: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, var(--tg-theme-accent-text-color, #64b5ef), var(--tg-theme-button-color, #5288c1))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    tripCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    tripHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    tripRoute: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '4px'
    },
    tripDate: {
      fontSize: '13px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    tripEarnings: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#4BB34B',
      textAlign: 'right'
    },
    tripStats: {
      display: 'flex',
      gap: '16px',
      fontSize: '13px',
      color: 'var(--tg-theme-hint-color, #708499)',
      marginTop: '8px'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: '600',
      display: 'inline-block',
      marginTop: '4px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--tg-theme-hint-color, #708499)'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={onBack}>
            ← Назад
          </button>
          <div style={styles.title}>История поездок</div>
        </div>
        <div style={{...styles.emptyState, paddingTop: '100px'}}>
          <div style={{fontSize: '32px', marginBottom: '12px'}}>⏳</div>
          <div>Загрузка истории...</div>
        </div>
      </div>
    );
  }

  const completedTrips = trips.filter(t => t.status === 'completed');

  // Группируем доставки по поездкам
  const tripsWithStats = completedTrips.map(trip => {
    const tripDeliveries = deliveries.filter(d => d.trip_id === trip.id && d.status === 'delivered');
    const earnings = tripDeliveries.reduce((sum, d) => sum + (d.parcel?.reward || 0), 0);

    return {
      ...trip,
      parcelsCount: tripDeliveries.length,
      earnings
    };
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Назад
        </button>
        <div style={styles.title}>История поездок</div>
      </div>

      <div style={styles.content}>
        {/* Общая статистика */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>✈️</span>
            <div style={styles.statNumber}>{stats.completedTrips}</div>
            <div style={styles.statLabel}>Завершено</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📦</span>
            <div style={styles.statNumber}>{stats.totalParcels}</div>
            <div style={styles.statLabel}>Посылок</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>💰</span>
            <div style={styles.statNumber}>₽{Math.round(stats.totalEarned)}</div>
            <div style={styles.statLabel}>Заработано</div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📊</span>
            <div style={styles.statNumber}>₽{Math.round(stats.averagePerTrip)}</div>
            <div style={styles.statLabel}>В среднем</div>
          </div>
        </div>

        {/* Список завершенных поездок */}
        {tripsWithStats.length > 0 ? (
          <>
            <h3 style={styles.sectionTitle}>
              <span>📋</span>
              <span>Завершенные поездки ({tripsWithStats.length})</span>
            </h3>

            {tripsWithStats.map(trip => {
              const departAt = new Date(trip.depart_at);

              return (
                <div key={trip.id} style={styles.tripCard}>
                  <div style={styles.tripHeader}>
                    <div>
                      <div style={styles.tripRoute}>
                        {getCity(trip.origin)} → {getCity(trip.destination)}
                      </div>
                      <div style={styles.tripDate}>
                        {departAt.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div style={styles.tripEarnings}>
                        +₽{trip.earnings}
                      </div>
                      <span style={{
                        ...styles.statusBadge,
                        background: 'rgba(75, 179, 75, 0.15)',
                        color: '#4BB34B'
                      }}>
                        Завершено
                      </span>
                    </div>
                  </div>

                  <div style={styles.tripStats}>
                    <div>📦 {trip.parcelsCount} {trip.parcelsCount === 1 ? 'посылка' : trip.parcelsCount < 5 ? 'посылки' : 'посылок'}</div>
                    {trip.flight_number && (
                      <div>🛫 {trip.flight_number}</div>
                    )}
                  </div>

                  {trip.comment && (
                    <div style={{
                      marginTop: '12px',
                      padding: '10px 12px',
                      background: 'rgba(100, 181, 239, 0.1)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: 'var(--tg-theme-hint-color, #708499)',
                      fontStyle: 'italic'
                    }}>
                      💬 {trip.comment}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div style={styles.emptyState}>
            <div style={{fontSize: '64px', marginBottom: '16px'}}>✈️</div>
            <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>
              Нет завершенных поездок
            </div>
            <div style={{fontSize: '14px'}}>
              Завершите первую поездку, чтобы увидеть статистику
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripHistoryScreen;
