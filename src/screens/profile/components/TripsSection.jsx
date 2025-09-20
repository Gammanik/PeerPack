import React, { useState } from 'react';

const TripsSection = () => {
  const [showTripRequests, setShowTripRequests] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showPackagesList, setShowPackagesList] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [responseForm, setResponseForm] = useState({
    tripDate: '',
    tripTime: '',
    price: '',
    message: '',
    flightNumber: '',
    canPickupFlexible: false,
    canDeliverFlexible: false
  });

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

  // Mock данные доступных посылок для откликов
  const mockAvailablePackages = [
    {
      id: 1,
      from: 'Москва',
      to: 'Дубай',
      description: 'Документы для визы',
      reward: 1500,
      size: 'xs',
      weight: 'light',
      tags: ['documents', 'urgent'],
      author: 'Анна К.',
      authorAvatar: 'https://i.pravatar.cc/100?img=5',
      deadline: '2025-01-20',
      responses: 2
    },
    {
      id: 2,
      from: 'Москва',
      to: 'Дубай',
      description: 'Подарок другу на день рождения',
      reward: 800,
      size: 's',
      weight: 'medium',
      tags: ['fragile'],
      author: 'Дмитрий М.',
      authorAvatar: 'https://i.pravatar.cc/100?img=8',
      deadline: '2025-01-18',
      responses: 0
    }
  ];

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setShowTripRequests(true);
  };

  const handleRequestAction = (requestId, action) => {
    console.log(`${action} request ${requestId}`);
    alert(`Заявка ${action === 'accept' ? 'принята' : 'отклонена'}!`);
  };

  const handlePackageResponse = (pkg) => {
    setSelectedPackage(pkg);
    setShowResponseForm(true);
    
    // Предзаполняем форму данными поездки
    const matchingTrip = mockTrips.find(trip => 
      trip.from === pkg.from && trip.to === pkg.to
    );
    
    if (matchingTrip) {
      setResponseForm({
        ...responseForm,
        tripDate: matchingTrip.date,
        tripTime: matchingTrip.time.split(' → ')[0],
        price: pkg.reward.toString()
      });
    }
  };

  const handleSendResponse = () => {
    console.log('Отправляем отклик:', {
      package: selectedPackage,
      response: responseForm
    });
    alert('Ваш отклик отправлен!');
    setShowResponseForm(false);
    setShowPackagesList(false);
    setResponseForm({
      tripDate: '',
      tripTime: '',
      price: '',
      message: '',
      flightNumber: '',
      canPickupFlexible: false,
      canDeliverFlexible: false
    });
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
    browsePackagesBanner: {
      background: 'linear-gradient(135deg, rgba(100, 181, 239, 0.15), rgba(82, 136, 193, 0.15))',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(82, 136, 193, 0.3)'
    },
    browseTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--tg-theme-button-color, #5288c1)',
      marginBottom: '6px'
    },
    browseSubtitle: {
      fontSize: '14px',
      color: 'var(--tg-theme-hint-color, #708499)',
      marginBottom: '12px'
    },
    browseButton: {
      background: 'var(--tg-theme-button-color, #5288c1)',
      border: 'none',
      borderRadius: '10px',
      padding: '8px 16px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
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

  return (
    <>
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

      {/* Баннер просмотра посылок */}
      <div 
        style={styles.browsePackagesBanner}
        onClick={() => setShowPackagesList(true)}
      >
        <div style={styles.browseTitle}>📦 Доступные посылки</div>
        <div style={styles.browseSubtitle}>Откликайтесь на посылки своими поездками</div>
        <button style={styles.browseButton}>
          Посмотреть посылки
        </button>
      </div>

      {mockTrips.map(trip => (
        <div 
          key={trip.id} 
          style={styles.tripCard}
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
          
          <div style={styles.clickHint}>
            👀 Нажмите чтобы посмотреть заявки
          </div>
        </div>
      ))}

      {/* Модальное окно со списком доступных посылок */}
      {showPackagesList && (
        <div style={styles.modalOverlay} onClick={() => setShowPackagesList(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Доступные посылки</div>
              <button 
                style={styles.closeButton}
                onClick={() => setShowPackagesList(false)}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalContent}>
              {mockAvailablePackages.map(pkg => (
                <div key={pkg.id} style={styles.packageCard}>
                  <div style={styles.packageHeader}>
                    <div style={styles.authorInfo}>
                      <img src={pkg.authorAvatar} alt={pkg.author} style={styles.authorAvatar} />
                      <div style={styles.authorName}>{pkg.author}</div>
                    </div>
                    <div style={styles.reward}>{pkg.reward}₽</div>
                  </div>

                  <div style={styles.packageRoute}>
                    <span>{pkg.from}</span>
                    <span style={styles.tripArrow}>→</span>
                    <span>{pkg.to}</span>
                  </div>

                  <div style={styles.packageDescription}>
                    📦 {pkg.description}
                  </div>

                  <div style={styles.tagsContainer}>
                    {pkg.tags.map(tag => (
                      <span key={tag} style={getTagStyle(tag)}>
                        {tag === 'urgent' ? '⚡ Срочно' :
                         tag === 'documents' ? '📄 Документы' :
                         tag === 'fragile' ? '🔸 Хрупкое' :
                         tag === 'valuable' ? '💎 Ценное' : tag}
                      </span>
                    ))}
                  </div>

                  <div style={styles.packageFooter}>
                    <div>⏰ До {pkg.deadline}</div>
                    <div>👥 {pkg.responses} откликов</div>
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
          </div>
        </div>
      )}

      {/* Модальное окно с заявками на поездку */}
      {showTripRequests && selectedTrip && (
        <div style={styles.modalOverlay} onClick={() => setShowTripRequests(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Заявки на поездку</div>
              <button 
                style={styles.closeButton}
                onClick={() => setShowTripRequests(false)}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={{marginBottom: 16, fontSize: 14, color: 'var(--tg-theme-hint-color, #708499)'}}>
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
                <div key={request.id} style={styles.packageCard}>
                  <div style={styles.packageHeader}>
                    <div style={styles.authorInfo}>
                      <img src={request.authorAvatar} alt={request.authorName} style={styles.authorAvatar} />
                      <div style={styles.authorName}>{request.authorName}</div>
                    </div>
                    <div style={styles.reward}>₽{request.reward}</div>
                  </div>

                  <div style={styles.packageDescription}>
                    📦 {request.packageDescription}
                  </div>

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
                    💬 {request.message}
                  </div>

                  {request.status === 'pending' ? (
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
                        onClick={() => handleRequestAction(request.id, 'accept')}
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
                        onClick={() => handleRequestAction(request.id, 'reject')}
                      >
                        ❌ Отклонить
                      </button>
                    </div>
                  ) : (
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
                  )}
                </div>
              ))}
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
                <p><strong>Посылка:</strong> {selectedPackage.description}</p>
                <p><strong>Маршрут:</strong> 
                    <span style={{marginLeft: '8px'}}>
                        <span style={{fontWeight: '600'}}>{selectedPackage.from}</span>
                        <span style={{color: 'var(--tg-theme-button-color, #5288c1)', margin: '0 6px', fontSize: '16px', fontWeight: '700'}}>→</span>
                        <span style={{fontWeight: '600'}}>{selectedPackage.to}</span>
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
    </>
  );
};

export default TripsSection;