import React, { useState, useEffect } from 'react';
import { supabaseApi } from '../../services/supabaseApi.js';

const TripDetailScreen = ({ tripId, onBack, onNavigate }) => {
  const [trip, setTrip] = useState(null);
  const [tripOffers, setTripOffers] = useState([]);
  const [availableParcels, setAvailableParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const currentUserId = 1; // TODO: Get from UserContext

  const [responseForm, setResponseForm] = useState({
    tripDate: '',
    tripTime: '',
    price: '',
    message: '',
    flightNumber: '',
    canPickupFlexible: false,
    canDeliverFlexible: false
  });

  useEffect(() => {
    loadTripDetails();
  }, [tripId]);

  const loadTripDetails = async () => {
    try {
      setLoading(true);

      // Загружаем детали поездки
      const { trips } = await supabaseApi.getUserTrips(currentUserId);
      const currentTrip = trips.find(t => t.id === tripId);
      setTrip(currentTrip);

      if (!currentTrip) {
        console.error('Trip not found');
        return;
      }

      // Загружаем заявки на поездку
      const { offers } = await supabaseApi.getOffersForTrip(tripId);
      setTripOffers(offers || []);

      // Помечаем все непросмотренные заявки как просмотренные
      const unviewedOffers = (offers || []).filter(offer => !offer.is_viewed);
      for (const offer of unviewedOffers) {
        await supabaseApi.markOfferAsViewed(offer.id);
      }

      // Загружаем доступные посылки по маршруту
      const { parcels } = await supabaseApi.getParcels();
      const filteredParcels = (parcels || []).filter(parcel =>
        getCity(parcel.origin) === getCity(currentTrip.origin) &&
        getCity(parcel.destination) === getCity(currentTrip.destination) &&
        parcel.user_id !== currentUserId
      );
      setAvailableParcels(filteredParcels);

    } catch (err) {
      console.error('Error loading trip details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCity = (location) => {
    if (!location) return '';
    return location.split(',')[0].trim();
  };

  const handleRequestAction = async (offerId, action) => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      const { error: updateError } = await supabaseApi.updateOfferStatus(offerId, newStatus);

      if (updateError) {
        alert('Ошибка: ' + updateError.message);
        return;
      }

      alert(`Заявка ${action === 'accept' ? 'принята' : 'отклонена'}!`);
      await loadTripDetails();
    } catch (err) {
      console.error('Error updating offer:', err);
      alert('Произошла ошибка');
    }
  };

  const handlePackageResponse = (pkg) => {
    setSelectedPackage(pkg);
    setShowResponseForm(true);

    if (trip) {
      const departAt = new Date(trip.depart_at);
      setResponseForm({
        ...responseForm,
        tripDate: departAt.toISOString().split('T')[0],
        tripTime: departAt.toTimeString().split(' ')[0].slice(0, 5),
        price: pkg.reward.toString()
      });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedPackage || !trip) return;

    try {
      const { error: offerError } = await supabaseApi.createOffer({
        parcel_id: selectedPackage.id,
        trip_id: trip.id,
        user_id: currentUserId,
        type: 'trip_to_parcel',
        price: parseFloat(responseForm.price) || selectedPackage.reward,
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

      await loadTripDetails();
    } catch (err) {
      console.error('Error sending response:', err);
      alert('Произошла ошибка');
    }
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
    subtitle: {
      fontSize: '14px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    content: {
      padding: '20px'
    },
    section: {
      marginBottom: '32px'
    },
    sectionHeader: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    tripInfo: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
      fontSize: '15px',
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    packageCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
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
      fontSize: '18px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--tg-theme-accent-text-color, #64b5ef), var(--tg-theme-button-color, #5288c1))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    packageDescription: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px'
    },
    badge: {
      background: '#FF3B30',
      color: 'white',
      fontSize: '10px',
      fontWeight: '600',
      padding: '3px 8px',
      borderRadius: '8px',
      marginLeft: '8px'
    },
    responseButton: {
      width: '100%',
      background: 'linear-gradient(135deg, rgba(82, 136, 193, 0.1), rgba(100, 181, 239, 0.1))',
      border: '1px solid var(--tg-theme-button-color, #5288c1)',
      borderRadius: '8px',
      padding: '10px',
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '14px',
      fontWeight: '500',
      marginTop: '12px',
      cursor: 'pointer'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px'
    },
    acceptButton: {
      flex: 1,
      padding: '10px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      background: 'linear-gradient(135deg, #4BB34B, #45a049)',
      color: 'white',
      border: 'none'
    },
    rejectButton: {
      flex: 1,
      padding: '10px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      background: 'transparent',
      color: 'var(--tg-theme-hint-color, #708499)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    // Модальное окно
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
      maxWidth: 480,
      width: '100%',
      maxHeight: '85vh',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      margin: '20px'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
      fontSize: 24,
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{...styles.emptyState, paddingTop: '100px'}}>
          <div style={{fontSize: '24px', marginBottom: '12px'}}>⏳</div>
          <div>Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={onBack}>
            ← Назад
          </button>
        </div>
        <div style={{...styles.emptyState, paddingTop: '100px'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>❌</div>
          <div>Поездка не найдена</div>
        </div>
      </div>
    );
  }

  const departAt = new Date(trip.depart_at);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Назад к поездкам
        </button>
        <div style={styles.title}>
          {getCity(trip.origin)} → {getCity(trip.destination)}
        </div>
        <div style={styles.subtitle}>
          {departAt.toLocaleDateString('ru-RU')} в {departAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div style={styles.content}>
        {/* Информация о поездке */}
        <div style={styles.tripInfo}>
          <div style={styles.infoRow}>
            🕐 {departAt.toLocaleDateString('ru-RU')} в {departAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </div>
          {trip.flight_number && (
            <div style={styles.infoRow}>
              🛫 Рейс {trip.flight_number}
            </div>
          )}
          {trip.capacity_kg && (
            <div style={styles.infoRow}>
              📦 До {trip.capacity_kg} кг
            </div>
          )}
          {trip.price && (
            <div style={styles.infoRow}>
              💰 От ₽{trip.price}
            </div>
          )}
          {trip.comment && (
            <div style={{
              fontSize: '14px',
              color: 'var(--tg-theme-text-color, #ffffff)',
              background: 'rgba(100, 181, 239, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '12px',
              fontStyle: 'italic'
            }}>
              💬 {trip.comment}
            </div>
          )}
        </div>

        {/* Заявки на поездку */}
        {tripOffers.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionHeader}>
              <span>📨</span>
              <span>Заявки ({tripOffers.length})</span>
            </h3>

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
                      <span style={styles.badge}>NEW</span>
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
                      <div style={{...styles.packageDescription, fontSize: '13px', color: 'var(--tg-theme-hint-color, #708499)'}}>
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
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.acceptButton}
                      onClick={() => handleRequestAction(offer.id, 'accept')}
                    >
                      ✅ Принять
                    </button>
                    <button
                      style={styles.rejectButton}
                      onClick={() => handleRequestAction(offer.id, 'reject')}
                    >
                      ❌ Отклонить
                    </button>
                  </div>
                ) : offer.status === 'accepted' ? (
                  <div style={{...styles.statusBadge, background: '#4BB34B', color: 'white'}}>
                    ✅ Принято
                  </div>
                ) : (
                  <div style={{...styles.statusBadge, background: '#888', color: 'white'}}>
                    ❌ Отклонено
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Доступные посылки по маршруту */}
        {availableParcels.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionHeader}>
              <span>📦</span>
              <span>Доступные посылки ({availableParcels.length})</span>
            </h3>
            <div style={{
              fontSize: '13px',
              color: 'var(--tg-theme-hint-color, #708499)',
              marginBottom: '16px'
            }}>
              Откликайтесь на посылки, которые подходят под ваш маршрут
            </div>

            {availableParcels.map(pkg => (
              <div key={pkg.id} style={styles.packageCard}>
                <div style={styles.packageHeader}>
                  <div style={{...styles.authorInfo, marginBottom: '8px'}}>
                    <img
                      src={pkg.user?.avatar_url || 'https://i.pravatar.cc/100'}
                      alt={pkg.user?.full_name || 'Пользователь'}
                      style={styles.authorAvatar}
                    />
                    <div style={styles.authorName}>{pkg.user?.full_name || 'Пользователь'}</div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px'}}>
                    <div style={{...styles.reward, fontSize: '20px'}}>
                      ₽{pkg.reward}
                    </div>
                    <div style={{fontSize: '12px', color: 'var(--tg-theme-hint-color, #708499)'}}>
                      ⚖️ {pkg.weight_kg} кг
                    </div>
                  </div>
                </div>

                <div style={{...styles.packageDescription, fontSize: '15px', fontWeight: '600'}}>
                  📦 {pkg.title || pkg.description}
                </div>

                {pkg.description && pkg.title && (
                  <div style={{fontSize: '13px', color: 'var(--tg-theme-hint-color, #708499)', marginTop: '6px'}}>
                    {pkg.description}
                  </div>
                )}

                <div style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '13px', color: 'var(--tg-theme-hint-color, #708499)'}}>
                  📅 {new Date(pkg.created_at).toLocaleDateString('ru-RU')}
                </div>

                <button
                  style={styles.responseButton}
                  onClick={() => handlePackageResponse(pkg)}
                >
                  ✈️ Откликнуться своей поездкой
                </button>
              </div>
            ))}
          </div>
        )}

        {tripOffers.length === 0 && availableParcels.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>📭</div>
            <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>
              Пока нет заявок и посылок
            </div>
            <div style={{fontSize: '14px'}}>
              По маршруту {getCity(trip.origin)} → {getCity(trip.destination)} пока нет доступных посылок
            </div>
          </div>
        )}
      </div>

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
                <p><strong>Вознаграждение:</strong> ₽{selectedPackage.reward}</p>
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
    </div>
  );
};

export default TripDetailScreen;
