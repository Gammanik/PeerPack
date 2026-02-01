import React, { useState, useEffect } from 'react';
import { supabaseApi } from '../../../services/supabaseApi.js';

const PackagesSection = () => {
  const [showPackagesList, setShowPackagesList] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Временно используем тестового пользователя (ID = 1)
  // TODO: заменить на реального пользователя из Telegram
  const currentUserId = 1;

  // Загружаем посылки пользователя при монтировании
  useEffect(() => {
    loadUserParcels();
  }, []);

  const loadUserParcels = async () => {
    try {
      setLoading(true);
      setError(null);
      const { parcels, error: parcelsError } = await supabaseApi.getUserParcels(currentUserId);

      if (parcelsError) {
        console.error('Error loading parcels:', parcelsError);
        setError('Ошибка загрузки посылок');
        return;
      }

      setPackages(parcels || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Загружаем отклики для выбранной посылки
  const loadPackageOffers = async (parcelId) => {
    try {
      const { offers: parcelOffers, error: offersError } = await supabaseApi.getOffersForParcel(parcelId);

      if (offersError) {
        console.error('Error loading offers:', offersError);
        return;
      }

      setOffers(parcelOffers || []);
    } catch (err) {
      console.error('Error loading offers:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#4BB34B';
      case 'assigned': return '#FFD700';
      case 'in_transit': return '#5288c1';
      case 'delivered': return '#888';
      case 'cancelled': return '#ff4444';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Открыто';
      case 'assigned': return 'Назначено';
      case 'in_transit': return 'В пути';
      case 'delivered': return 'Доставлено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const handlePackageClick = async (pkg) => {
    setSelectedPackage(pkg);
    await loadPackageOffers(pkg.id);
    setShowPackagesList(true);
  };

  const handleResponseAction = async (offerId, action) => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      const { success, error: updateError } = await supabaseApi.updateOfferStatus(offerId, newStatus);

      if (updateError) {
        alert('Ошибка: ' + updateError.message);
        return;
      }

      alert(`Отклик ${action === 'accept' ? 'принят' : 'отклонен'}!`);

      // Обновляем список откликов
      if (selectedPackage) {
        await loadPackageOffers(selectedPackage.id);
      }

      // Обновляем список посылок
      await loadUserParcels();
    } catch (err) {
      console.error('Error updating offer:', err);
      alert('Произошла ошибка');
    }
  };

  const styles = {
    packageCard: {
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
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
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
      marginBottom: '8px'
    },
    route: {
      fontSize: '15px',
      color: 'var(--tg-theme-hint-color, #708499)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    routeFrom: {
      fontWeight: '500'
    },
    routeArrow: {
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '16px',
      fontWeight: '700'
    },
    routeTo: {
      fontWeight: '500'
    },
    status: {
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: '600',
      color: 'white'
    },
    cardInfo: {
      color: 'var(--tg-theme-hint-color, #708499)',
      marginBottom: '8px',
      fontSize: '15px'
    },
    responsesBadge: {
      background: 'linear-gradient(135deg, var(--tg-theme-accent-text-color, #64b5ef), var(--tg-theme-button-color, #5288c1))',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: '600'
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
      justifyContent: 'center',
      transition: 'all 0.2s ease'
    },
    modalContent: {
      padding: 20,
      maxHeight: 'calc(85vh - 80px)',
      overflowY: 'auto'
    },
    responseCard: {
      background: 'var(--tg-theme-bg-color, #17212b)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    responseHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    responseAvatar: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid var(--tg-theme-button-color, #5288c1)'
    },
    responseAuthor: {
      flex: 1
    },
    authorName: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '2px'
    },
    authorRating: {
      fontSize: '13px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    responsePrice: {
      fontSize: '18px',
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
    responseMessage: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontStyle: 'italic',
      marginBottom: '12px',
      lineHeight: '1.4',
      background: 'rgba(100, 181, 239, 0.1)',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(100, 181, 239, 0.2)'
    },
    responseActions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      flex: 1,
      padding: '10px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    acceptButton: {
      background: 'linear-gradient(135deg, #4BB34B, #45a049)',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 12px rgba(75, 179, 75, 0.3)'
    },
    rejectButton: {
      background: 'transparent',
      color: 'var(--tg-theme-hint-color, #708499)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }
  };

  // Показываем индикатор загрузки
  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '40px', color: 'var(--tg-theme-hint-color, #708499)'}}>
        <div style={{fontSize: '24px', marginBottom: '12px'}}>⏳</div>
        <div>Загрузка посылок...</div>
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
          onClick={loadUserParcels}
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

  // Показываем пустое состояние
  if (packages.length === 0) {
    return (
      <div style={{textAlign: 'center', padding: '40px', color: 'var(--tg-theme-hint-color, #708499)'}}>
        <div style={{fontSize: '48px', marginBottom: '16px'}}>📦</div>
        <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>Нет посылок</div>
        <div style={{fontSize: '14px'}}>Добавьте первую посылку, чтобы начать</div>
      </div>
    );
  }

  return (
    <>
      {packages.map(pkg => (
        <div
          key={pkg.id}
          style={styles.packageCard}
          onClick={() => handlePackageClick(pkg)}
        >
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitle}>{pkg.description}</div>
              <div style={styles.route}>
                <span style={styles.routeFrom}>{pkg.origin}</span>
                <span style={styles.routeArrow}>→</span>
                <span style={styles.routeTo}>{pkg.destination}</span>
              </div>
            </div>
            <div style={{
              ...styles.status,
              backgroundColor: getStatusColor(pkg.status)
            }}>
              {getStatusText(pkg.status)}
            </div>
          </div>

          <div style={styles.cardInfo}>
            💰 {pkg.reward}₽
          </div>

          {pkg.status === 'delivered' && pkg.carrier_name && (
            <div style={styles.cardInfo}>
              👤 Курьер: {pkg.carrier_name}
            </div>
          )}

          {pkg.status === 'open' && (
            <div style={styles.clickHint}>
              👀 Нажмите чтобы посмотреть отклики
            </div>
          )}
        </div>
      ))}

      {/* Модальное окно с откликами курьеров */}
      {showPackagesList && selectedPackage && (
        <div style={styles.modalOverlay} onClick={() => setShowPackagesList(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Отклики курьеров</div>
              <button 
                style={styles.closeButton}
                onClick={() => setShowPackagesList(false)}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={{marginBottom: 16, fontSize: 14, color: 'var(--tg-theme-hint-color, #708499)'}}>
                <p><strong>Посылка:</strong> {selectedPackage.description}</p>
                <p><strong>Маршрут:</strong>
                    <span style={{marginLeft: '8px'}}>
                        <span style={{fontWeight: '600'}}>{selectedPackage.origin}</span>
                        <span style={{color: 'var(--tg-theme-button-color, #5288c1)', margin: '0 6px', fontSize: '16px', fontWeight: '700'}}>→</span>
                        <span style={{fontWeight: '600'}}>{selectedPackage.destination}</span>
                    </span>
                </p>
                <p><strong>Вознаграждение:</strong> ₽{selectedPackage.reward}</p>
              </div>

              {offers.map(offer => (
                <div key={offer.id} style={styles.responseCard}>
                  <div style={styles.responseHeader}>
                    <img
                      src={offer.user?.avatar_url || 'https://i.pravatar.cc/100'}
                      alt={offer.user?.full_name || 'Пользователь'}
                      style={styles.responseAvatar}
                    />
                    <div style={styles.responseAuthor}>
                      <div style={styles.authorName}>{offer.user?.full_name || 'Пользователь'}</div>
                      <div style={styles.authorRating}>
                        {offer.user?.rating && `⭐ ${offer.user.rating} • `}
                        Отклик от {new Date(offer.created_at).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <div style={styles.responsePrice}>₽{offer.trip?.price || selectedPackage.reward}</div>
                  </div>

                  {offer.trip && (
                    <div style={styles.tripDetails}>
                      ✈️ {new Date(offer.trip.depart_at).toLocaleDateString('ru-RU')}
                      {offer.trip.flight_number && ` • Рейс ${offer.trip.flight_number}`}
                    </div>
                  )}

                  {offer.message && (
                    <div style={styles.responseMessage}>
                      💬 {offer.message}
                    </div>
                  )}

                  {offer.status === 'pending' && (
                    <div style={styles.responseActions}>
                      <button
                        style={{...styles.actionButton, ...styles.acceptButton}}
                        onClick={() => handleResponseAction(offer.id, 'accept')}
                      >
                        ✅ Принять
                      </button>
                      <button
                        style={{...styles.actionButton, ...styles.rejectButton}}
                        onClick={() => handleResponseAction(offer.id, 'reject')}
                      >
                        ❌ Отклонить
                      </button>
                    </div>
                  )}

                  {offer.status === 'accepted' && (
                    <div style={{
                      background: '#4BB34B',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}>
                      ✅ Принято
                    </div>
                  )}

                  {offer.status === 'rejected' && (
                    <div style={{
                      background: '#888',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}>
                      ❌ Отклонено
                    </div>
                  )}
                </div>
              ))}

              {offers.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: 'var(--tg-theme-hint-color, #708499)',
                  fontSize: 14,
                  padding: 20
                }}>
                  Пока нет откликов на эту посылку
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackagesSection;