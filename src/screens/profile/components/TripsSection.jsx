import React, { useState, useEffect } from 'react';
import AddTripForm from '../../../domains/user/components/AddTripForm.jsx';
import { supabaseApi } from '../../../services/supabaseApi.js';
import { useUser } from '../../../shared/context/UserContext.jsx';

const TripsSection = ({ onNavigate }) => {
  const { user } = useUser();
  const currentUserId = user?.id;

  const [showAddTripForm, setShowAddTripForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed, cancelled

  // Данные из Supabase
  const [trips, setTrips] = useState([]);
  const [unviewedCounts, setUnviewedCounts] = useState({}); // { tripId: count }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const availableCities = ['Москва', 'Санкт-Петербург', 'Дубай', 'Сочи', 'Казань', 'Новосибирск', 'Екатеринбург'];

  // Загружаем поездки пользователя при монтировании
  useEffect(() => {
    if (currentUserId) {
      loadUserTrips();
    }
  }, [currentUserId]);

  const loadUserTrips = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      setError(null);
      const { trips: userTrips, error: tripsError } = await supabaseApi.getUserTrips(currentUserId);

      if (tripsError) {
        console.error('Error loading trips:', tripsError);
        setError('Ошибка загрузки поездок');
        return;
      }

      setTrips(userTrips || []);

      // Загружаем количество непросмотренных заявок для каждой поездки
      const counts = {};
      for (const trip of userTrips || []) {
        const { offers } = await supabaseApi.getOffersForTrip(trip.id);
        const unviewedCount = (offers || []).filter(offer => !offer.is_viewed).length;
        counts[trip.id] = unviewedCount;
      }
      setUnviewedCounts(counts);
    } catch (err) {
      console.error('Error:', err);
      setError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };


  // Извлекаем только город из строки (до запятой)
  const getCity = (location) => {
    if (!location) return '';
    return location.split(',')[0].trim();
  };

  const handleTripClick = (trip) => {
    // Переходим к детальной странице поездки
    if (onNavigate) {
      onNavigate('trip-detail', { id: trip.id });
    }
  };


  const handleAddTrip = async (tripData) => {
    try {
      // Маппинг полей из формы в формат API
      const capacityMap = {
        'small': 1,
        'medium': 5,
        'large': 10,
        'xl': 20
      };

      // Комбинируем дату и время
      const departDateTime = `${tripData.date}T${tripData.time}:00`;

      const { success, trip_id, error: tripError } = await supabaseApi.createTrip({
        user_id: currentUserId,
        origin: tripData.from,
        destination: tripData.to,
        depart_at: new Date(departDateTime).toISOString(),
        price: parseInt(tripData.price),
        capacity_kg: capacityMap[tripData.capacity] || 5,
        flight_number: tripData.transportDetails || null,
        comment: tripData.comment || null,
        status: 'active'
      });

      if (tripError) {
        alert('Ошибка: ' + tripError.message);
        return;
      }

      alert('Поездка успешно добавлена!');
      setShowAddTripForm(false);
      await loadUserTrips();
    } catch (err) {
      console.error('Error adding trip:', err);
      alert('Произошла ошибка');
    }
  };

  // Фильтруем поездки по статусу
  const filteredTrips = trips.filter(trip => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return trip.status === 'active';
    if (filterStatus === 'completed') return trip.status === 'completed';
    if (filterStatus === 'cancelled') return trip.status === 'cancelled';
    return true;
  });

  const styles = {
    filterTabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      overflowX: 'auto',
      padding: '4px'
    },
    filterTab: {
      padding: '8px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap'
    },
    filterTabActive: {
      background: 'var(--tg-theme-button-color, #5288c1)',
      color: 'white',
      border: '1px solid var(--tg-theme-button-color, #5288c1)'
    },
    addTripBanner: {
      background: 'var(--tg-theme-button-color, #5288c1)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      border: 'none'
    },
    addTripTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: 'white',
      marginBottom: '6px'
    },
    addTripSubtitle: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.85)',
      marginBottom: '0'
    },
    tripCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      cursor: 'pointer',
      transition: 'background 0.2s ease'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    tripFrom: {
      fontWeight: '600'
    },
    tripArrow: {
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '18px',
      fontWeight: '700'
    },
    tripTo: {
      fontWeight: '600'
    },
    route: {
      fontSize: '14px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    responsesBadge: {
      background: 'rgba(100, 181, 239, 0.15)',
      color: 'var(--tg-theme-button-color, #5288c1)',
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600'
    },
    cardInfo: {
      color: 'var(--tg-theme-hint-color, #708499)',
      marginBottom: '8px',
      fontSize: '15px'
    },
    comment: {
      fontSize: '13px',
      color: 'var(--tg-theme-hint-color, #708499)',
      background: 'rgba(255, 255, 255, 0.03)',
      padding: '10px 12px',
      borderRadius: '8px',
      marginTop: '10px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }
  };

  // Показываем индикатор загрузки
  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '40px', color: 'var(--tg-theme-hint-color, #708499)'}}>
        <div style={{fontSize: '24px', marginBottom: '12px'}}>⏳</div>
        <div>Загрузка поездок...</div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div style={{textAlign: 'center', padding: '40px', color: '#ff4444'}}>
        <div style={{fontSize: '24px', marginBottom: '12px'}}>⚠️</div>
        <div>{error}</div>
        <button
          onClick={loadUserTrips}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: 'var(--tg-theme-button-color, #5288c1)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  const filterCounts = {
    all: trips.length,
    active: trips.filter(t => t.status === 'active').length,
    completed: trips.filter(t => t.status === 'completed').length,
    cancelled: trips.filter(t => t.status === 'cancelled').length
  };

  return (
    <>
      {/* Баннер добавления поездки */}
      <div
        style={styles.addTripBanner}
        onClick={() => setShowAddTripForm(true)}
      >
        <div style={styles.addTripTitle}>+ Добавить поездку</div>
        <div style={styles.addTripSubtitle}>Предложите услуги доставки и заработайте</div>
      </div>

      {/* Табы фильтрации */}
      <div style={styles.filterTabs}>
        <div
          style={{
            ...styles.filterTab,
            ...(filterStatus === 'all' && styles.filterTabActive)
          }}
          onClick={() => setFilterStatus('all')}
        >
          Все ({filterCounts.all})
        </div>
        <div
          style={{
            ...styles.filterTab,
            ...(filterStatus === 'active' && styles.filterTabActive)
          }}
          onClick={() => setFilterStatus('active')}
        >
          Активные ({filterCounts.active})
        </div>
        <div
          style={{
            ...styles.filterTab,
            ...(filterStatus === 'completed' && styles.filterTabActive)
          }}
          onClick={() => setFilterStatus('completed')}
        >
          Завершенные ({filterCounts.completed})
        </div>
        {filterCounts.cancelled > 0 && (
          <div
            style={{
              ...styles.filterTab,
              ...(filterStatus === 'cancelled' && styles.filterTabActive)
            }}
            onClick={() => setFilterStatus('cancelled')}
          >
            Отмененные ({filterCounts.cancelled})
          </div>
        )}
      </div>


      {filteredTrips.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: 'var(--tg-theme-hint-color, #708499)'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>✈️</div>
          <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>
            {trips.length === 0 ? 'Нет поездок' : `Нет ${filterStatus === 'active' ? 'активных' : filterStatus === 'completed' ? 'завершенных' : 'отмененных'} поездок`}
          </div>
          <div style={{fontSize: '14px'}}>
            {trips.length === 0 ? 'Добавьте первую поездку, чтобы начать зарабатывать' : 'Измените фильтр для просмотра других поездок'}
          </div>
        </div>
      ) : null}

      {filteredTrips.map(trip => {
        const departAt = new Date(trip.depart_at);
        const formattedDate = departAt.toLocaleDateString('ru-RU');
        const formattedTime = departAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const unviewedCount = unviewedCounts[trip.id] || 0;

        return (
          <div
            key={trip.id}
            style={{
              ...styles.tripCard,
              ...(unviewedCount > 0 && {
                border: '2px solid #FF3B30',
                boxShadow: '0 4px 16px rgba(255, 59, 48, 0.2)'
              })
            }}
            onClick={() => handleTripClick(trip)}
          >
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.cardTitle}>
                  <span style={styles.tripFrom}>{getCity(trip.origin)}</span>
                  <span style={styles.tripArrow}>→</span>
                  <span style={styles.tripTo}>{getCity(trip.destination)}</span>
                  {unviewedCount > 0 && (
                    <span style={{
                      background: '#FF3B30',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      marginLeft: '6px'
                    }}>
                      {unviewedCount}
                    </span>
                  )}
                </div>
                {trip.flight_number && (
                  <div style={styles.route}>🛫 Рейс {trip.flight_number}</div>
                )}
              </div>
              <div style={{
                ...styles.responsesBadge,
                ...(trip.status === 'active' && {
                  background: 'rgba(75, 179, 75, 0.15)',
                  color: '#4BB34B'
                }),
                ...(trip.status === 'completed' && {
                  background: 'rgba(136, 136, 136, 0.15)',
                  color: '#888'
                })
              }}>
                {trip.status === 'active' ? 'Активна' : trip.status === 'completed' ? 'Завершена' : trip.status}
              </div>
            </div>

            <div style={styles.cardInfo}>
              🕐 {formattedDate} в {formattedTime}
            </div>
            {trip.capacity_kg && (
              <div style={styles.cardInfo}>
                📦 До {trip.capacity_kg} кг
              </div>
            )}

            {trip.comment && (
              <div style={styles.comment}>
                {trip.comment}
              </div>
            )}
          </div>
        );
      })}

      <AddTripForm
        showAddTripForm={showAddTripForm}
        setShowAddTripForm={setShowAddTripForm}
        onAddTrip={handleAddTrip}
        availableCities={availableCities}
      />
    </>
  );
};

export default TripsSection;