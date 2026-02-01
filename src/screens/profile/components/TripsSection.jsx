import React, { useState, useEffect } from 'react';
import AddTripForm from '../../../domains/user/components/AddTripForm.jsx';
import { supabaseApi } from '../../../services/supabaseApi.js';

const TripsSection = ({ onNavigate }) => {
  const [showAddTripForm, setShowAddTripForm] = useState(false);

  // Данные из Supabase
  const [trips, setTrips] = useState([]);
  const [unviewedCounts, setUnviewedCounts] = useState({}); // { tripId: count }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Временно используем тестового пользователя
  const currentUserId = 1;

  const availableCities = ['Москва', 'Санкт-Петербург', 'Дубай', 'Сочи', 'Казань', 'Новосибирск', 'Екатеринбург'];

  // Загружаем поездки пользователя при монтировании
  useEffect(() => {
    loadUserTrips();
  }, []);

  const loadUserTrips = async () => {
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

  const styles = {
    addTripBanner: {
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 24px rgba(82, 136, 193, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    addTripTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'white',
      marginBottom: '8px'
    },
    addTripSubtitle: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '16px'
    },
    addTripButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      padding: '10px 20px',
      color: 'white',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    tripCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        borderColor: 'var(--tg-theme-button-color, #5288c1)'
      }
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
      fontSize: '15px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    responsesBadge: {
      background: 'linear-gradient(135deg, var(--tg-theme-accent-text-color, #64b5ef), var(--tg-theme-button-color, #5288c1))',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: '600'
    },
    cardInfo: {
      color: 'var(--tg-theme-hint-color, #708499)',
      marginBottom: '8px',
      fontSize: '15px'
    },
    comment: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      background: 'rgba(100, 181, 239, 0.1)',
      padding: '12px 16px',
      borderRadius: '12px',
      fontStyle: 'italic',
      marginTop: '12px',
      border: '1px solid rgba(100, 181, 239, 0.2)'
    },
    clickHint: {
      textAlign: 'center',
      padding: '12px',
      background: 'linear-gradient(135deg, rgba(82, 136, 193, 0.1), rgba(100, 181, 239, 0.1))',
      borderTop: '1px solid rgba(82, 136, 193, 0.2)',
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '14px',
      fontWeight: '500',
      marginTop: '12px',
      borderRadius: '0 0 20px 20px',
      marginBottom: '-20px',
      marginLeft: '-20px',
      marginRight: '-20px'
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

  return (
    <>
      {/* Баннер добавления поездки */}
      <div
        style={styles.addTripBanner}
        onClick={() => setShowAddTripForm(true)}
      >
        <div style={styles.addTripTitle}>✈️ Планируете поездку?</div>
        <div style={styles.addTripSubtitle}>Предложите свои услуги доставки и заработайте</div>
        <button style={styles.addTripButton}>
          + Добавить поездку
        </button>
      </div>


      {trips.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: 'var(--tg-theme-hint-color, #708499)'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>✈️</div>
          <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>Нет поездок</div>
          <div style={{fontSize: '14px'}}>Добавьте первую поездку, чтобы начать зарабатывать</div>
        </div>
      ) : null}

      {trips.map(trip => {
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
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      marginLeft: '8px'
                    }}>
                      {unviewedCount} NEW
                    </span>
                  )}
                </div>
                {trip.flight_number && (
                  <div style={styles.route}>🛫 Рейс {trip.flight_number}</div>
                )}
              </div>
              <div style={{
                ...styles.responsesBadge,
                ...(trip.status === 'active' && { background: '#4BB34B' }),
                ...(trip.status === 'completed' && { background: '#888' })
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
                💬 {trip.comment}
              </div>
            )}

            <div style={styles.clickHint}>
              👀 Нажмите чтобы посмотреть заявки
            </div>
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