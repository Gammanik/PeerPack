import React, { useState } from 'react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [showTripRequests, setShowTripRequests] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const mockPackages = [
    {
      id: 1,
      description: 'Документы в папке',
      from: 'Москва',
      to: 'Дубай',
      status: 'active',
      price: 1500,
      responses: 3
    },
    {
      id: 2,
      description: 'Подарок - ювелирные украшения',
      from: 'Дубай',
      to: 'Москва',
      status: 'completed',
      price: 2000,
      courier: 'Фатима'
    },
    {
      id: 3,
      description: 'Медикаменты',
      from: 'Москва',
      to: 'Стамбул',
      status: 'waiting',
      price: 1200,
      responses: 0
    }
  ];

  const mockTrips = [
    {
      id: 1,
      from: 'Москва',
      to: 'Дубай',
      date: '2025-01-20',
      time: '14:30 → 22:45',
      airport: 'Шереметьево → DXB',
      requests: 3,
      price: 1800,
      comment: 'Командировка в Дубай, есть место для документов и посылок'
    }
  ];

  // Mock данные о заявках на поездку
  const mockTripRequests = [
    {
      id: 1,
      authorName: 'Анна К.',
      authorAvatar: 'https://i.pravatar.cc/100?img=5',
      packageDescription: 'Документы для визы',
      reward: 1500,
      message: 'Очень срочно нужно доставить документы! Готова оплатить дополнительно за быструю доставку.',
      requestDate: '2025-01-18',
      status: 'pending'
    },
    {
      id: 2,
      authorName: 'Георгий П.',
      authorAvatar: 'https://i.pravatar.cc/100?img=12',
      packageDescription: 'Лекарства для бабушки',
      reward: 1200,
      message: 'Важные лекарства, буду очень благодарен за помощь',
      requestDate: '2025-01-19',
      status: 'pending'
    },
    {
      id: 3,
      authorName: 'Мария С.',
      authorAvatar: 'https://i.pravatar.cc/100?img=31',
      packageDescription: 'Подарок на свадьбу',
      reward: 2000,
      message: 'Ювелирные украшения в подарок на свадьбу подруги. Очень деликатная посылка.',
      requestDate: '2025-01-17',
      status: 'accepted'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4BB34B';
      case 'completed': return '#888';
      case 'waiting': return '#FFD700';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Активно';
      case 'completed': return 'Доставлено';
      case 'waiting': return 'Ожидание';
      default: return status;
    }
  };

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setShowTripRequests(true);
  };

  const handleRequestAction = (requestId, action) => {
    console.log(`${action} request ${requestId}`);
    // Здесь будет API вызов
    alert(`Заявка ${action === 'accept' ? 'принята' : 'отклонена'}!`);
  };

  const styles = {
    container: {
      padding: '20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px'
    },
    avatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid var(--tg-theme-button-color, #5288c1)'
    },
    userName: {
      fontSize: '20px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    tabs: {
      display: 'flex',
      marginBottom: '20px',
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '12px',
      padding: '4px'
    },
    tab: {
      flex: 1,
      padding: '12px',
      background: 'transparent',
      border: 'none',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'all 0.2s ease'
    },
    activeTab: {
      background: 'var(--tg-theme-button-color, #5288c1)',
      color: 'var(--tg-theme-button-text-color, #ffffff)'
    },
    card: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '12px',
      border: '0.5px solid var(--tg-theme-hint-color, #708499)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '4px',
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
      padding: '4px 8px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white'
    },
    cardInfo: {
      color: 'var(--tg-theme-hint-color, #708499)',
      marginBottom: '8px',
      fontSize: '14px'
    },
    responsesBadge: {
      background: 'var(--tg-theme-accent-text-color, #64b5ef)',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600'
    },
    comment: {
      fontSize: '13px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      background: 'rgba(100, 181, 239, 0.1)',
      padding: '8px 12px',
      borderRadius: '8px',
      fontStyle: 'italic',
      marginTop: '8px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    addTripBanner: {
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s ease'
    },
    addTripTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'white',
      marginBottom: '8px'
    },
    addTripSubtitle: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '12px'
    },
    addTripButton: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      padding: '8px 16px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: 12,
      padding: 0,
      maxWidth: 480,
      width: '100%',
      maxHeight: '85vh',
      overflow: 'hidden',
      border: '0.5px solid var(--tg-theme-hint-color, #708499)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 16px 12px',
      borderBottom: '0.5px solid var(--tg-theme-hint-color, #708499)',
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontSize: 18,
      cursor: 'pointer'
    },
    modalContent: {
      padding: 16,
      maxHeight: 'calc(85vh - 60px)',
      overflowY: 'auto',
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    requestCard: {
      background: 'var(--tg-theme-bg-color, #17212b)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      border: '0.5px solid var(--tg-theme-hint-color, #708499)'
    },
    requestHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    requestAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    requestAuthor: {
      flex: 1
    },
    authorName: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '2px'
    },
    requestDate: {
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    requestReward: {
      fontSize: '16px',
      fontWeight: '700',
      color: 'var(--tg-theme-accent-text-color, #64b5ef)'
    },
    packageDesc: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px',
      fontWeight: '500'
    },
    requestMessage: {
      fontSize: '13px',
      color: 'var(--tg-theme-hint-color, #708499)',
      fontStyle: 'italic',
      marginBottom: '12px',
      lineHeight: '1.4'
    },
    requestActions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      flex: 1,
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    acceptButton: {
      background: 'var(--tg-theme-button-color, #5288c1)',
      color: 'white',
      border: 'none'
    },
    rejectButton: {
      background: 'transparent',
      color: 'var(--tg-theme-hint-color, #708499)',
      border: '0.5px solid var(--tg-theme-hint-color, #708499)'
    },
    acceptedBadge: {
      background: '#4BB34B',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <img 
            src="https://i.pravatar.cc/100?img=50" 
            alt="Никита"
            style={styles.avatar}
          />
          <div style={styles.userName}>Никита</div>
        </div>
      </div>

      <div style={styles.tabs}>
        <button 
          style={{
            ...styles.tab,
            ...(activeTab === 'packages' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('packages')}
        >
          📦 Посылки ({mockPackages.length})
        </button>
        <button 
          style={{
            ...styles.tab,
            ...(activeTab === 'trips' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('trips')}
        >
          ✈️ Поездки ({mockTrips.length})
        </button>
      </div>

      {activeTab === 'packages' ? (
        <div>
          {mockPackages.map(pkg => (
            <div key={pkg.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>{pkg.description}</div>
                  <div style={styles.route}>
                    <span style={styles.routeFrom}>{pkg.from}</span>
                    <span style={styles.routeArrow}>→</span>
                    <span style={styles.routeTo}>{pkg.to}</span>
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
                💰 {pkg.price}₽
              </div>
              
              {pkg.status === 'completed' && pkg.courier && (
                <div style={styles.cardInfo}>
                  👤 Курьер: {pkg.courier}
                </div>
              )}
              
              {pkg.status === 'active' && pkg.responses > 0 && (
                <div style={styles.cardInfo}>
                  <span style={styles.responsesBadge}>
                    {pkg.responses} откликов
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Баннер добавления поездки */}
          <div 
            style={styles.addTripBanner}
            onClick={() => alert('Функция добавления поездки будет реализована')}
          >
            <div style={styles.addTripTitle}>✈️ Планируете поездку?</div>
            <div style={styles.addTripSubtitle}>Предложите свои услуги доставки и заработайте</div>
            <button style={styles.addTripButton}>
              + Добавить поездку
            </button>
          </div>

          {mockTrips.map(trip => (
            <div 
              key={trip.id} 
              style={{...styles.card, cursor: 'pointer'}}
              onClick={() => handleTripClick(trip)}
            >
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>
                    <span style={styles.tripFrom}>{trip.from}</span>
                    <span style={styles.tripArrow}>→</span>
                    <span style={styles.tripTo}>{trip.to}</span>
                  </div>
                  <div style={styles.route}>🛫 {trip.airport}</div>
                </div>
                <div style={styles.responsesBadge}>
                  {trip.requests} заявок
                </div>
              </div>
              
              <div style={styles.cardInfo}>
                🕐 {trip.date} в {trip.time}
              </div>
              <div style={styles.cardInfo}>
                💰 {trip.price}₽
              </div>
              
              <div style={styles.comment}>
                💬 {trip.comment}
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(82, 136, 193, 0.1)',
                borderTop: '0.5px solid var(--tg-theme-hint-color, #708499)',
                color: 'var(--tg-theme-button-color, #5288c1)',
                fontSize: '14px',
                fontWeight: '500',
                marginTop: '8px',
                borderRadius: '0 0 16px 16px',
                marginBottom: '-20px',
                marginLeft: '-20px',
                marginRight: '-20px'
              }}>
                👀 Нажмите чтобы посмотреть заявки
              </div>
            </div>
          ))}
          
          {mockTrips.length === 0 && (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✈️</div>
              <div style={{ fontSize: '16px' }}>У вас пока нет поездок</div>
            </div>
          )}
        </div>
      )}

      {/* Модальное окно с заявками на поездку */}
      {showTripRequests && selectedTrip && (
        <div style={styles.modalOverlay} onClick={() => setShowTripRequests(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Заявки на поездку</h3>
              <button 
                style={styles.closeButton}
                onClick={() => setShowTripRequests(false)}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={{marginBottom: 16, fontSize: 14}}>
                <p><strong>Маршрут:</strong> 
                    <span style={{marginLeft: '8px'}}>
                        <span style={{fontWeight: '600'}}>{selectedTrip.from}</span>
                        <span style={{color: 'var(--tg-theme-button-color, #5288c1)', margin: '0 6px', fontSize: '16px', fontWeight: '700'}}>→</span>
                        <span style={{fontWeight: '600'}}>{selectedTrip.to}</span>
                    </span>
                </p>
                <p><strong>Дата:</strong> {selectedTrip.date} в {selectedTrip.time}</p>
                <p><strong>Рейс:</strong> {selectedTrip.airport}</p>
              </div>

              {mockTripRequests.map(request => (
                <div key={request.id} style={styles.requestCard}>
                  <div style={styles.requestHeader}>
                    <img 
                      src={request.authorAvatar} 
                      alt={request.authorName}
                      style={styles.requestAvatar}
                    />
                    <div style={styles.requestAuthor}>
                      <div style={styles.authorName}>{request.authorName}</div>
                      <div style={styles.requestDate}>Заявка от {request.requestDate}</div>
                    </div>
                    <div style={styles.requestReward}>₽{request.reward}</div>
                  </div>

                  <div style={styles.packageDesc}>
                    📦 {request.packageDescription}
                  </div>

                  <div style={styles.requestMessage}>
                    💬 {request.message}
                  </div>

                  {request.status === 'pending' ? (
                    <div style={styles.requestActions}>
                      <button 
                        style={{...styles.actionButton, ...styles.acceptButton}}
                        onClick={() => handleRequestAction(request.id, 'accept')}
                      >
                        ✅ Принять
                      </button>
                      <button 
                        style={{...styles.actionButton, ...styles.rejectButton}}
                        onClick={() => handleRequestAction(request.id, 'reject')}
                      >
                        ❌ Отклонить
                      </button>
                    </div>
                  ) : (
                    <div style={styles.acceptedBadge}>
                      ✅ Принято
                    </div>
                  )}
                </div>
              ))}

              {mockTripRequests.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: 'var(--tg-theme-hint-color, #708499)',
                  fontSize: 14,
                  padding: 20
                }}>
                  Пока нет заявок на эту поездку
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;