import React, { useState, useEffect } from 'react';
import { supabaseApi } from '../../../services/supabaseApi.js';
import { useUser } from '../../../shared/context/UserContext.jsx';

const PackagesSection = ({ onNavigate }) => {
  const { user } = useUser();
  const currentUserId = user?.id;

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, open, assigned, delivered, cancelled

  // Загружаем посылки пользователя при монтировании
  useEffect(() => {
    if (currentUserId) {
      loadUserParcels();
    }
  }, [currentUserId]);

  const loadUserParcels = async () => {
    if (!currentUserId) return;

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

  // Фильтруем посылки по статусу
  const filteredPackages = packages.filter(pkg => {
    if (filterStatus === 'all') return true;
    return pkg.status === filterStatus;
  });

  const filterCounts = {
    all: packages.length,
    open: packages.filter(p => p.status === 'open').length,
    assigned: packages.filter(p => p.status === 'assigned').length,
    delivered: packages.filter(p => p.status === 'delivered').length,
    cancelled: packages.filter(p => p.status === 'cancelled').length
  };

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
            ...(filterStatus === 'open' && styles.filterTabActive)
          }}
          onClick={() => setFilterStatus('open')}
        >
          Открытые ({filterCounts.open})
        </div>
        <div
          style={{
            ...styles.filterTab,
            ...(filterStatus === 'assigned' && styles.filterTabActive)
          }}
          onClick={() => setFilterStatus('assigned')}
        >
          Назначенные ({filterCounts.assigned})
        </div>
        <div
          style={{
            ...styles.filterTab,
            ...(filterStatus === 'delivered' && styles.filterTabActive)
          }}
          onClick={() => setFilterStatus('delivered')}
        >
          Доставленные ({filterCounts.delivered})
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

      {filteredPackages.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: 'var(--tg-theme-hint-color, #708499)'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📦</div>
          <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>
            Нет посылок с таким статусом
          </div>
          <div style={{fontSize: '14px'}}>
            Измените фильтр для просмотра других посылок
          </div>
        </div>
      ) : null}

      {filteredPackages.map(pkg => (
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