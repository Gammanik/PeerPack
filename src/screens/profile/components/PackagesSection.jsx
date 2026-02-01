import React, { useState, useEffect } from 'react';
import { supabaseApi } from '../../../services/supabaseApi.js';

const PackagesSection = ({ onNavigate }) => {
  const [packages, setPackages] = useState([]);
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

  const handlePackageClick = (pkg) => {
    // Переходим к детальной странице посылки
    if (onNavigate) {
      onNavigate('parcel-detail', { id: pkg.id });
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

  // Извлекаем только город из строки (до запятой)
  const getCity = (location) => {
    if (!location) return '';
    return location.split(',')[0].trim();
  };

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
              <div style={styles.cardTitle}>{pkg.title || pkg.description}</div>
              <div style={styles.route}>
                <span style={styles.routeFrom}>{getCity(pkg.origin)}</span>
                <span style={styles.routeArrow}>→</span>
                <span style={styles.routeTo}>{getCity(pkg.destination)}</span>
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
    </>
  );
};

export default PackagesSection;