import React, { useState, useEffect } from 'react';
import AddTripForm from '../../../domains/user/components/AddTripForm.jsx';
import { supabaseApi } from '../../../services/supabaseApi.js';

const TripsSection = () => {
  const [showTripRequests, setShowTripRequests] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showAddTripForm, setShowAddTripForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Данные из Supabase
  const [trips, setTrips] = useState([]);
  const [tripOffers, setTripOffers] = useState([]);
  const [availableParcels, setAvailableParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [unviewedCounts, setUnviewedCounts] = useState({}); // { tripId: count }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Временно используем тестового пользователя
  const currentUserId = 1;

  const availableCities = ['Москва', 'Санкт-Петербург', 'Дубай', 'Сочи', 'Казань', 'Новосибирск', 'Екатеринбург'];

  const [responseForm, setResponseForm] = useState({
    tripDate: '',
    tripTime: '',
    price: '',
    message: '',
    flightNumber: '',
    canPickupFlexible: false,
    canDeliverFlexible: false
  });

  // Загружаем поездки пользователя при монтировании
  useEffect(() => {
    loadUserTrips();
    loadAvailableParcels();
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

  const loadAvailableParcels = async () => {
    try {
      const { parcels, error: parcelsError } = await supabaseApi.getParcels();

      if (parcelsError) {
        console.error('Error loading parcels:', parcelsError);
        return;
      }

      setAvailableParcels(parcels || []);
    } catch (err) {
      console.error('Error loading parcels:', err);
    }
  };

  const loadTripOffers = async (tripId) => {
    try {
      const { offers, error: offersError } = await supabaseApi.getOffersForTrip(tripId);

      if (offersError) {
        console.error('Error loading offers:', offersError);
        return [];
      }

      setTripOffers(offers || []);
      return offers || [];
    } catch (err) {
      console.error('Error loading offers:', err);
      return [];
    }
  };

  // Извлекаем только город из строки (до запятой)
  const getCity = (location) => {
    if (!location) return '';
    return location.split(',')[0].trim();
  };

  const handleTripClick = async (trip) => {
    setSelectedTrip(trip);
    const offersData = await loadTripOffers(trip.id);

    // Помечаем все непросмотренные заявки как просмотренные
    const unviewedOffers = offersData.filter(offer => !offer.is_viewed);
    for (const offer of unviewedOffers) {
      await supabaseApi.markOfferAsViewed(offer.id);
    }

    // Если были непросмотренные, обновляем список и обнуляем счетчик
    if (unviewedOffers.length > 0) {
      await loadTripOffers(trip.id);
      setUnviewedCounts(prev => ({ ...prev, [trip.id]: 0 }));
    }

    // Фильтруем доступные посылки по маршруту поездки
    const parcelsForTrip = availableParcels.filter(parcel =>
      getCity(parcel.origin) === getCity(trip.origin) &&
      getCity(parcel.destination) === getCity(trip.destination) &&
      parcel.user_id !== currentUserId // Исключаем собственные посылки
    );
    setFilteredParcels(parcelsForTrip);

    setShowTripRequests(true);
  };

  const handleRequestAction = async (offerId, action) => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      const { success, error: updateError } = await supabaseApi.updateOfferStatus(offerId, newStatus);

      if (updateError) {
        alert('Ошибка: ' + updateError.message);
        return;
      }

      alert(`Заявка ${action === 'accept' ? 'принята' : 'отклонена'}!`);

      // Обновляем список откликов
      if (selectedTrip) {
        await loadTripOffers(selectedTrip.id);
      }

      // Обновляем список поездок
      await loadUserTrips();
    } catch (err) {
      console.error('Error updating offer:', err);
      alert('Произошла ошибка');
    }
  };

  const handlePackageResponse = (pkg) => {
    setSelectedPackage(pkg);
    setShowResponseForm(true);

    // Предзаполняем форму данными поездки
    const matchingTrip = trips.find(trip =>
      trip.origin === pkg.origin && trip.destination === pkg.destination
    );

    if (matchingTrip) {
      const departAt = new Date(matchingTrip.depart_at);
      setResponseForm({
        ...responseForm,
        tripDate: departAt.toISOString().split('T')[0],
        tripTime: departAt.toTimeString().split(' ')[0].slice(0, 5),
        price: pkg.reward.toString()
      });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedPackage) return;

    try {
      // Находим подходящую поездку пользователя
      const matchingTrip = trips.find(trip =>
        trip.origin === selectedPackage.origin &&
        trip.destination === selectedPackage.destination
      );

      if (!matchingTrip) {
        alert('Поездка не найдена. Создайте поездку сначала.');
        return;
      }

      // Создаем отклик
      const { success, error: offerError } = await supabaseApi.createOffer({
        parcel_id: selectedPackage.id,
        trip_id: matchingTrip.id,
        user_id: currentUserId,
        type: 'trip_to_parcel',
        message: responseForm.message,
        status: 'pending'
      });

      if (offerError) {
        alert('Ошибка: ' + offerError.message);
        return;
      }

      alert('Ваш отклик отправлен!');
      setShowResponseForm(false);
      setResponseForm({
        tripDate: '',
        tripTime: '',
        price: '',
        message: '',
        flightNumber: '',
        canPickupFlexible: false,
        canDeliverFlexible: false
      });

      await loadUserTrips();
    } catch (err) {
      console.error('Error sending response:', err);
      alert('Произошла ошибка');
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

  const getTagStyle = (tag) => ({
    display: 'inline-block',
    padding: '3px 8px',
    margin: '2px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '500',
    background: tag === 'urgent' ? 'rgba(255, 69, 0, 0.2)' :
               tag === 'documents' ? 'rgba(0, 123, 255, 0.2)' :
               tag === 'fragile' ? 'rgba(255, 193, 7, 0.2)' :
               tag === 'valuable' ? 'rgba(102, 16, 242, 0.2)' :
               'rgba(108, 117, 125, 0.2)',
    color: tag === 'urgent' ? '#ff4500' :
           tag === 'documents' ? '#007bff' :
           tag === 'fragile' ? '#ffc107' :
           tag === 'valuable' ? '#6610f2' :
           '#6c757d',
    border: `1px solid ${tag === 'urgent' ? '#ff4500' :
           tag === 'documents' ? '#007bff' :
           tag === 'fragile' ? '#ffc107' :
           tag === 'valuable' ? '#6610f2' :
           '#6c757d'}40`
  });

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
    },
    // Модальные окна
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: 20,
      padding: 0,
      maxWidth: 480,
      width: '100%',
      maxHeight: '85vh',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 20px 16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'linear-gradient(135deg, var(--tg-theme-secondary-bg-color, #232e3c), rgba(35, 46, 60, 0.8))'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontSize: 20,
      cursor: 'pointer',
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalContent: {
      padding: 20,
      maxHeight: 'calc(85vh - 80px)',
      overflowY: 'auto'
    },
    packageCard: {
      background: 'var(--tg-theme-bg-color, #17212b)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    packageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    authorInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    authorAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    authorName: {
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    reward: {
      fontSize: '16px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--tg-theme-accent-text-color, #64b5ef), var(--tg-theme-button-color, #5288c1))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    packageRoute: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    packageDescription: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px'
    },
    tagsContainer: {
      marginBottom: '8px'
    },
    packageFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    responseButton: {
      width: '100%',
      background: 'linear-gradient(135deg, rgba(82, 136, 193, 0.1), rgba(100, 181, 239, 0.1))',
      border: '1px solid var(--tg-theme-button-color, #5288c1)',
      borderRadius: '8px',
      padding: '8px',
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '14px',
      fontWeight: '500',
      marginTop: '8px',
      cursor: 'pointer'
    },
    // Форма отклика
    formGroup: {
      marginBottom: 15
    },
    label: {
      color: 'var(--tg-theme-hint-color, #708499)',
      marginBottom: 6,
      display: 'block',
      fontSize: 14,
      fontWeight: 500
    },
    input: {
      width: '100%',
      padding: 12,
      background: 'var(--tg-theme-bg-color, #17212b)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontSize: 14,
      outline: 'none',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: 12,
      background: 'var(--tg-theme-bg-color, #17212b)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontSize: 14,
      minHeight: 80,
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    modalButtons: {
      display: 'flex',
      gap: 10,
      marginTop: 20
    },
    cancelButton: {
      flex: 1,
      padding: 12,
      background: 'transparent',
      color: 'var(--tg-theme-hint-color, #708499)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 14
    },
    sendButton: {
      flex: 1,
      padding: 12,
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      color: 'white',
      border: 'none',
      borderRadius: 8,
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: 14
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


      {/* Модальное окно с заявками на поездку */}
      {showTripRequests && selectedTrip && (
        <div style={styles.modalOverlay} onClick={() => setShowTripRequests(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>
                {getCity(selectedTrip.origin)} → {getCity(selectedTrip.destination)}
              </div>
              <button
                style={styles.closeButton}
                onClick={() => setShowTripRequests(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={{marginBottom: 20, fontSize: 14, color: 'var(--tg-theme-hint-color, #708499)', paddingBottom: 16, borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <p style={{marginBottom: 8}}>
                  <strong>🕐 Дата:</strong> {new Date(selectedTrip.depart_at).toLocaleString('ru-RU')}
                </p>
                {selectedTrip.flight_number && (
                  <p style={{marginBottom: 0}}><strong>🛫 Рейс:</strong> {selectedTrip.flight_number}</p>
                )}
              </div>

              {/* Секция с заявками */}
              {tripOffers.length > 0 && (
                <>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--tg-theme-text-color, #ffffff)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>📨</span>
                    <span>Заявки ({tripOffers.length})</span>
                    {tripOffers.some(o => !o.is_viewed) && (
                      <span style={{
                        background: '#FF3B30',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: '600',
                        padding: '2px 6px',
                        borderRadius: '8px'
                      }}>
                        NEW
                      </span>
                    )}
                  </h3>
                </>
              )}

              {tripOffers.map(offer => (
                <div key={offer.id} style={{
                  ...styles.packageCard,
                  ...((!offer.is_viewed) && {
                    border: '2px solid #FF3B30',
                    background: 'rgba(255, 59, 48, 0.05)'
                  })
                }}>
                  <div style={styles.packageHeader}>
                    <div style={styles.authorInfo}>
                      <img
                        src={offer.user?.avatar_url || 'https://i.pravatar.cc/100'}
                        alt={offer.user?.full_name || 'Пользователь'}
                        style={styles.authorAvatar}
                      />
                      <div style={styles.authorName}>{offer.user?.full_name || 'Пользователь'}</div>
                      {!offer.is_viewed && (
                        <span style={{
                          background: '#FF3B30',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: '600',
                          padding: '2px 6px',
                          borderRadius: '8px'
                        }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <div style={styles.reward}>₽{offer.parcel?.reward || '—'}</div>
                  </div>

                  {offer.parcel && (
                    <>
                      <div style={styles.packageDescription}>
                        📦 {offer.parcel.title || offer.parcel.description}
                      </div>
                      {offer.parcel.description && offer.parcel.title && (
                        <div style={{...styles.packageDescription, fontSize: '13px', color: 'var(--tg-theme-hint-color, #708499)', marginTop: '4px'}}>
                          {offer.parcel.description}
                        </div>
                      )}
                    </>
                  )}

                  {offer.message && (
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--tg-theme-hint-color, #708499)',
                      fontStyle: 'italic',
                      marginBottom: '12px',
                      lineHeight: '1.4',
                      background: 'rgba(100, 181, 239, 0.1)',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(100, 181, 239, 0.2)'
                    }}>
                      💬 {offer.message}
                    </div>
                  )}

                  {offer.status === 'pending' ? (
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: 'linear-gradient(135deg, #4BB34B, #45a049)',
                          color: 'white',
                          border: 'none'
                        }}
                        onClick={() => handleRequestAction(offer.id, 'accept')}
                      >
                        ✅ Принять
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          background: 'transparent',
                          color: 'var(--tg-theme-hint-color, #708499)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                        onClick={() => handleRequestAction(offer.id, 'reject')}
                      >
                        ❌ Отклонить
                      </button>
                    </div>
                  ) : offer.status === 'accepted' ? (
                    <div style={{
                      background: '#4BB34B',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      ✅ Принято
                    </div>
                  ) : (
                    <div style={{
                      background: '#888',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      ❌ Отклонено
                    </div>
                  )}
                </div>
              ))}

              {/* Секция с доступными посылками по маршруту */}
              {filteredParcels.length > 0 && (
                <>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--tg-theme-text-color, #ffffff)',
                    marginTop: tripOffers.length > 0 ? '32px' : '0',
                    marginBottom: '16px',
                    paddingTop: tripOffers.length > 0 ? '24px' : '0',
                    borderTop: tripOffers.length > 0 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>📦</span>
                    <span>Доступные посылки ({filteredParcels.length})</span>
                  </h3>
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--tg-theme-hint-color, #708499)',
                    marginBottom: '16px'
                  }}>
                    Откликайтесь на посылки, которые подходят под ваш маршрут
                  </div>

                  {filteredParcels.map(pkg => (
                    <div key={pkg.id} style={styles.packageCard}>
                      <div style={styles.packageHeader}>
                        <div style={{flex: 1}}>
                          <div style={{...styles.authorInfo, marginBottom: '8px'}}>
                            <img
                              src={pkg.user?.avatar_url || 'https://i.pravatar.cc/100'}
                              alt={pkg.user?.full_name || 'Пользователь'}
                              style={styles.authorAvatar}
                            />
                            <div style={styles.authorName}>{pkg.user?.full_name || 'Пользователь'}</div>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '4px'
                        }}>
                          <div style={{
                            ...styles.reward,
                            fontSize: '20px',
                            fontWeight: '700'
                          }}>
                            ₽{pkg.reward}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'var(--tg-theme-hint-color, #708499)'
                          }}>
                            ⚖️ {pkg.weight_kg} кг
                          </div>
                        </div>
                      </div>

                      <div style={{
                        ...styles.packageDescription,
                        marginTop: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: 'var(--tg-theme-text-color, #ffffff)'
                      }}>
                        📦 {pkg.title || pkg.description}
                      </div>

                      {pkg.description && pkg.title && (
                        <div style={{
                          fontSize: '13px',
                          color: 'var(--tg-theme-hint-color, #708499)',
                          marginTop: '6px',
                          lineHeight: '1.4'
                        }}>
                          {pkg.description}
                        </div>
                      )}

                      <div style={{
                        ...styles.packageFooter,
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <div style={{fontSize: '13px'}}>
                          📅 {new Date(pkg.created_at).toLocaleDateString('ru-RU')}
                        </div>
                      </div>

                      <button
                        style={styles.responseButton}
                        onClick={() => handlePackageResponse(pkg)}
                      >
                        ✈️ Откликнуться своей поездкой
                      </button>
                    </div>
                  ))}
                </>
              )}

              {/* Показываем сообщение если нет ни заявок, ни доступных посылок */}
              {tripOffers.length === 0 && filteredParcels.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: 'var(--tg-theme-hint-color, #708499)',
                  fontSize: 14,
                  padding: '40px 20px'
                }}>
                  <div style={{fontSize: '48px', marginBottom: '16px'}}>📭</div>
                  <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>
                    Пока нет заявок и посылок
                  </div>
                  <div style={{fontSize: '14px'}}>
                    По маршруту {getCity(selectedTrip.origin)} → {getCity(selectedTrip.destination)} пока нет доступных посылок
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно формы отклика */}
      {showResponseForm && selectedPackage && (
        <div style={styles.modalOverlay} onClick={() => setShowResponseForm(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Отклик на посылку</div>
              <button 
                style={styles.closeButton}
                onClick={() => setShowResponseForm(false)}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={{marginBottom: 16, fontSize: 14, color: 'var(--tg-theme-hint-color, #708499)'}}>
                <p><strong>Посылка:</strong> {selectedPackage.title || selectedPackage.description}</p>
                {selectedPackage.description && selectedPackage.title && (
                  <p><strong>Описание:</strong> {selectedPackage.description}</p>
                )}
                <p><strong>Маршрут:</strong>
                    <span style={{marginLeft: '8px'}}>
                        <span style={{fontWeight: '600'}}>{getCity(selectedPackage.origin)}</span>
                        <span style={{color: 'var(--tg-theme-button-color, #5288c1)', margin: '0 6px', fontSize: '16px', fontWeight: '700'}}>→</span>
                        <span style={{fontWeight: '600'}}>{getCity(selectedPackage.destination)}</span>
                    </span>
                </p>
                <p><strong>Вознаграждение:</strong> ₽{selectedPackage.reward}</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Дата поездки</label>
                <input
                  type="date"
                  value={responseForm.tripDate}
                  onChange={(e) => setResponseForm({...responseForm, tripDate: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Время вылета</label>
                <input
                  type="time"
                  value={responseForm.tripTime}
                  onChange={(e) => setResponseForm({...responseForm, tripTime: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Номер рейса</label>
                <input
                  type="text"
                  placeholder="SU522, S7890..."
                  value={responseForm.flightNumber}
                  onChange={(e) => setResponseForm({...responseForm, flightNumber: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Ваша цена (₽)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={responseForm.price}
                  onChange={(e) => setResponseForm({...responseForm, price: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <div style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={responseForm.canPickupFlexible}
                    onChange={(e) => setResponseForm({...responseForm, canPickupFlexible: e.target.checked})}
                  />
                  <label>Могу забрать в удобное для вас время</label>
                </div>
                <div style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={responseForm.canDeliverFlexible}
                    onChange={(e) => setResponseForm({...responseForm, canDeliverFlexible: e.target.checked})}
                  />
                  <label>Могу доставить в удобное для вас место</label>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Сообщение отправителю</label>
                <textarea
                  value={responseForm.message}
                  onChange={(e) => setResponseForm({...responseForm, message: e.target.value})}
                  placeholder="Расскажите об условиях доставки, опыте..."
                  style={styles.textarea}
                />
              </div>

              <div style={styles.modalButtons}>
                <button 
                  style={styles.cancelButton}
                  onClick={() => setShowResponseForm(false)}
                >
                  Отмена
                </button>
                <button 
                  style={styles.sendButton}
                  onClick={handleSendResponse}
                >
                  Отправить отклик
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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