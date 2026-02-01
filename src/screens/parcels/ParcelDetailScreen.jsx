import React, { useState, useEffect } from 'react';
import { supabaseApi } from '../../services/supabaseApi.js';

const ParcelDetailScreen = ({ parcelId, onBack, onNavigate }) => {
  const [parcel, setParcel] = useState(null);
  const [parcelOffers, setParcelOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = 1; // TODO: Get from UserContext

  useEffect(() => {
    loadParcelDetails();
  }, [parcelId]);

  const loadParcelDetails = async () => {
    try {
      setLoading(true);

      // Загружаем детали посылки
      const { parcels } = await supabaseApi.getUserParcels(currentUserId);
      const currentParcel = parcels.find(p => p.id === parcelId);
      setParcel(currentParcel);

      if (!currentParcel) {
        console.error('Parcel not found');
        return;
      }

      // Загружаем отклики на посылку
      const { offers } = await supabaseApi.getOffersForParcel(parcelId);
      setParcelOffers(offers || []);

      // Помечаем все непросмотренные отклики как просмотренные
      const unviewedOffers = (offers || []).filter(offer => !offer.is_viewed);
      for (const offer of unviewedOffers) {
        await supabaseApi.markOfferAsViewed(offer.id);
      }

    } catch (err) {
      console.error('Error loading parcel details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCity = (location) => {
    if (!location) return '';
    return location.split(',')[0].trim();
  };

  const handleOfferAction = async (offerId, action) => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      const { error: updateError } = await supabaseApi.updateOfferStatus(offerId, newStatus);

      if (updateError) {
        alert('Ошибка: ' + updateError.message);
        return;
      }

      alert(`Отклик ${action === 'accept' ? 'принят' : 'отклонён'}!`);
      await loadParcelDetails();
    } catch (err) {
      console.error('Error updating offer:', err);
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
    parcelInfo: {
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
    offerCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    offerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    courierInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    courierAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    courierName: {
      fontSize: '15px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    rating: {
      fontSize: '13px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    price: {
      fontSize: '20px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--tg-theme-accent-text-color, #64b5ef), var(--tg-theme-button-color, #5288c1))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    tripDetails: {
      fontSize: '14px',
      color: 'var(--tg-theme-hint-color, #708499)',
      marginBottom: '8px'
    },
    message: {
      fontSize: '13px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontStyle: 'italic',
      background: 'rgba(100, 181, 239, 0.1)',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(100, 181, 239, 0.2)',
      marginTop: '12px'
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
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      display: 'inline-block'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: 'var(--tg-theme-hint-color, #708499)'
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

  if (!parcel) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={onBack}>
            ← Назад
          </button>
        </div>
        <div style={{...styles.emptyState, paddingTop: '100px'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>❌</div>
          <div>Посылка не найдена</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Назад к посылкам
        </button>
        <div style={styles.title}>
          {getCity(parcel.origin)} → {getCity(parcel.destination)}
        </div>
        <div style={styles.subtitle}>
          {parcel.title || parcel.description}
        </div>
      </div>

      <div style={styles.content}>
        {/* Информация о посылке */}
        <div style={styles.parcelInfo}>
          <div style={styles.infoRow}>
            📦 {parcel.title || parcel.description}
          </div>
          {parcel.description && parcel.title && (
            <div style={{...styles.infoRow, fontSize: '13px', color: 'var(--tg-theme-hint-color, #708499)'}}>
              {parcel.description}
            </div>
          )}
          <div style={styles.infoRow}>
            ⚖️ Вес: {parcel.weight_kg} кг
          </div>
          <div style={styles.infoRow}>
            💰 Вознаграждение: ₽{parcel.reward}
          </div>
          <div style={styles.infoRow}>
            📍 Откуда: {parcel.origin}
          </div>
          <div style={styles.infoRow}>
            📍 Куда: {parcel.destination}
          </div>
          {parcel.pickup_address && (
            <div style={styles.infoRow}>
              🔼 Забор: {parcel.pickup_address}
            </div>
          )}
          {parcel.delivery_address && (
            <div style={styles.infoRow}>
              🔽 Доставка: {parcel.delivery_address}
            </div>
          )}
          <div style={{
            ...styles.infoRow,
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            📅 Создано: {new Date(parcel.created_at).toLocaleDateString('ru-RU')}
          </div>
          <div style={styles.infoRow}>
            {parcel.status === 'open' && (
              <span style={{...styles.statusBadge, background: '#4BB34B', color: 'white'}}>
                🟢 Открыто
              </span>
            )}
            {parcel.status === 'assigned' && (
              <span style={{...styles.statusBadge, background: '#FFD700', color: '#1a1a1a'}}>
                ⏳ Назначено
              </span>
            )}
            {parcel.status === 'delivered' && (
              <span style={{...styles.statusBadge, background: '#888', color: 'white'}}>
                ✅ Доставлено
              </span>
            )}
          </div>
        </div>

        {/* Отклики курьеров */}
        {parcelOffers.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionHeader}>
              <span>✈️</span>
              <span>Отклики курьеров ({parcelOffers.length})</span>
            </h3>

            {parcelOffers.map(offer => {
              const trip = offer.trip;
              const courier = offer.user;
              const departAt = trip?.depart_at ? new Date(trip.depart_at) : null;

              return (
                <div key={offer.id} style={{
                  ...styles.offerCard,
                  ...((!offer.is_viewed) && {
                    border: '2px solid #FF3B30',
                    background: 'rgba(255, 59, 48, 0.05)'
                  })
                }}>
                  <div style={styles.offerHeader}>
                    <div style={styles.courierInfo}>
                      <img
                        src={courier?.avatar_url || 'https://i.pravatar.cc/100'}
                        alt={courier?.full_name || 'Курьер'}
                        style={styles.courierAvatar}
                      />
                      <div>
                        <div style={styles.courierName}>
                          {courier?.full_name || 'Курьер'}
                          {!offer.is_viewed && (
                            <span style={styles.badge}>NEW</span>
                          )}
                        </div>
                        {courier?.rating && (
                          <div style={styles.rating}>
                            ⭐ {courier.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={styles.price}>
                      ₽{offer.price || trip?.price || parcel.reward}
                    </div>
                  </div>

                  {trip && (
                    <>
                      {departAt && (
                        <div style={styles.tripDetails}>
                          🕐 {departAt.toLocaleDateString('ru-RU')} в {departAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                      {trip.flight_number && (
                        <div style={styles.tripDetails}>
                          🛫 Рейс {trip.flight_number}
                        </div>
                      )}
                      {trip.capacity_kg && (
                        <div style={styles.tripDetails}>
                          📦 Вместимость до {trip.capacity_kg} кг
                        </div>
                      )}
                    </>
                  )}

                  {offer.message && (
                    <div style={styles.message}>
                      💬 {offer.message}
                    </div>
                  )}

                  {offer.status === 'pending' ? (
                    <div style={styles.actionButtons}>
                      <button
                        style={styles.acceptButton}
                        onClick={() => handleOfferAction(offer.id, 'accept')}
                      >
                        ✅ Принять
                      </button>
                      <button
                        style={styles.rejectButton}
                        onClick={() => handleOfferAction(offer.id, 'reject')}
                      >
                        ❌ Отклонить
                      </button>
                    </div>
                  ) : offer.status === 'accepted' ? (
                    <div style={{...styles.statusBadge, background: '#4BB34B', color: 'white', marginTop: '12px'}}>
                      ✅ Отклик принят
                    </div>
                  ) : (
                    <div style={{...styles.statusBadge, background: '#888', color: 'white', marginTop: '12px'}}>
                      ❌ Отклонено
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {parcelOffers.length === 0 && (
          <div style={styles.emptyState}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>📭</div>
            <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>
              Пока нет откликов
            </div>
            <div style={{fontSize: '14px'}}>
              Курьеры увидят вашу посылку и смогут откликнуться
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParcelDetailScreen;
