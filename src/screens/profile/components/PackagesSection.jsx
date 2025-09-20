import React, { useState } from 'react';

const PackagesSection = () => {
  const [showPackagesList, setShowPackagesList] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const mockPackages = [
    {
      id: 1,
      description: 'Документы в папке',
      from: 'Москва',
      to: 'Дубай',
      status: 'active',
      price: 1500,
      responses: 3,
      created: '2025-01-15'
    },
    {
      id: 2,
      description: 'Подарок - ювелирные украшения',
      from: 'Дубай',
      to: 'Москва',
      status: 'completed',
      price: 2000,
      courier: 'Фатима',
      created: '2025-01-10'
    },
    {
      id: 3,
      description: 'Медикаменты',
      from: 'Москва',
      to: 'Стамбул',
      status: 'waiting',
      price: 1200,
      responses: 0,
      created: '2025-01-12'
    }
  ];

  // Mock данные об откликах курьеров на посылки
  const mockCourierResponses = [
    {
      id: 1,
      courierName: 'Алексей К.',
      courierAvatar: 'https://i.pravatar.cc/100?img=15',
      courierRating: 4.7,
      proposedPrice: 1400,
      tripDate: '2025-01-18',
      flightNumber: 'SU522',
      message: 'Регулярно летаю этим рейсом, гарантирую безопасную доставку документов.',
      responseDate: '2025-01-16',
      status: 'pending'
    },
    {
      id: 2,
      courierName: 'Марина В.',
      courierAvatar: 'https://i.pravatar.cc/100?img=25',
      courierRating: 4.9,
      proposedPrice: 1500,
      tripDate: '2025-01-19',
      flightNumber: 'A6142',
      message: 'Опытный курьер, доставлю быстро и надежно. Есть рекомендации.',
      responseDate: '2025-01-16',
      status: 'pending'
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

  const handlePackageClick = (pkg) => {
    if (pkg.status === 'active' && pkg.responses > 0) {
      setSelectedPackage(pkg);
      setShowPackagesList(true);
    }
  };

  const handleResponseAction = (responseId, action) => {
    console.log(`${action} response ${responseId}`);
    alert(`Отклик ${action === 'accept' ? 'принят' : 'отклонен'}!`);
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

  return (
    <>
      {mockPackages.map(pkg => (
        <div 
          key={pkg.id} 
          style={styles.packageCard}
          onClick={() => handlePackageClick(pkg)}
        >
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
            <>
              <div style={styles.cardInfo}>
                <span style={styles.responsesBadge}>
                  {pkg.responses} откликов
                </span>
              </div>
              <div style={styles.clickHint}>
                👀 Нажмите чтобы посмотреть отклики
              </div>
            </>
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
                        <span style={{fontWeight: '600'}}>{selectedPackage.from}</span>
                        <span style={{color: 'var(--tg-theme-button-color, #5288c1)', margin: '0 6px', fontSize: '16px', fontWeight: '700'}}>→</span>
                        <span style={{fontWeight: '600'}}>{selectedPackage.to}</span>
                    </span>
                </p>
                <p><strong>Вознаграждение:</strong> ₽{selectedPackage.price}</p>
              </div>

              {mockCourierResponses.map(response => (
                <div key={response.id} style={styles.responseCard}>
                  <div style={styles.responseHeader}>
                    <img 
                      src={response.courierAvatar} 
                      alt={response.courierName}
                      style={styles.responseAvatar}
                    />
                    <div style={styles.responseAuthor}>
                      <div style={styles.authorName}>{response.courierName}</div>
                      <div style={styles.authorRating}>⭐ {response.courierRating} • Отклик от {response.responseDate}</div>
                    </div>
                    <div style={styles.responsePrice}>₽{response.proposedPrice}</div>
                  </div>

                  <div style={styles.tripDetails}>
                    ✈️ {response.tripDate} • Рейс {response.flightNumber}
                  </div>

                  <div style={styles.responseMessage}>
                    💬 {response.message}
                  </div>

                  {response.status === 'pending' && (
                    <div style={styles.responseActions}>
                      <button 
                        style={{...styles.actionButton, ...styles.acceptButton}}
                        onClick={() => handleResponseAction(response.id, 'accept')}
                      >
                        ✅ Принять
                      </button>
                      <button 
                        style={{...styles.actionButton, ...styles.rejectButton}}
                        onClick={() => handleResponseAction(response.id, 'reject')}
                      >
                        ❌ Отклонить
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {mockCourierResponses.length === 0 && (
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