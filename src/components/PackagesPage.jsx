import React, { useState } from 'react';

const PackagesPage = () => {
  const [packages, setPackages] = useState([
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
      pickupAddress: 'ул. Тверская, 10',
      deliveryAddress: 'Business Bay, офис 205',
      deadline: '2025-01-20',
      responses: 2,
      status: 'active'
    },
    {
      id: 2,
      from: 'Санкт-Петербург',
      to: 'Стамбул',
      description: 'Подарок другу на день рождения',
      reward: 800,
      size: 's',
      weight: 'medium',
      tags: ['fragile'],
      author: 'Дмитрий М.',
      authorAvatar: 'https://i.pravatar.cc/100?img=8',
      pickupAddress: 'Невский проспект, 28',
      deliveryAddress: 'Таксим, центр города',
      deadline: '2025-01-18',
      responses: 0,
      status: 'active'
    },
    {
      id: 3,
      from: 'Москва',
      to: 'Тбилиси',
      description: 'Лекарства для бабушки',
      reward: 1200,
      size: 'xs',
      weight: 'light',
      tags: ['urgent', 'valuable'],
      author: 'Георгий П.',
      authorAvatar: 'https://i.pravatar.cc/100?img=12',
      pickupAddress: 'Аптека на Арбате',
      deliveryAddress: 'Район Ваке',
      deadline: '2025-01-16',
      responses: 5,
      status: 'active'
    }
  ]);

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

  // Mock данные о поездках пользователя
  const [myTrips] = useState([
    {
      id: 1,
      from: 'Москва',
      to: 'Дубай',
      date: '2025-01-15',
      time: '15:00',
      flightNumber: 'SU522',
      availableSpace: 'medium'
    },
    {
      id: 2,
      from: 'Москва',
      to: 'Тбилиси',
      date: '2025-01-17',
      time: '09:30',
      flightNumber: 'SU1860',
      availableSpace: 'large'
    }
  ]);

  const handleResponseToPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowResponseForm(true);
    
    // Предзаполняем форму если есть подходящая поездка
    const matchingTrip = myTrips.find(trip => 
      trip.from === pkg.from && trip.to === pkg.to
    );
    
    if (matchingTrip) {
      setResponseForm({
        ...responseForm,
        tripDate: matchingTrip.date,
        tripTime: matchingTrip.time,
        flightNumber: matchingTrip.flightNumber,
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
    padding: '2px 6px',
    margin: '2px',
    borderRadius: '4px',
    fontSize: '10px',
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
           '#6c757d'
  });

  const styles = {
    container: {
      padding: '20px'
    },
    header: {
      marginBottom: '20px',
      textAlign: 'center'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '14px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    packageCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: '0.5px solid var(--tg-theme-hint-color, #708499)',
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
      fontSize: '18px',
      fontWeight: '700',
      color: 'var(--tg-theme-accent-text-color, #64b5ef)'
    },
    route: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    routeFrom: {
      fontWeight: '600'
    },
    routeArrow: {
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '18px',
      fontWeight: '700'
    },
    routeTo: {
      fontWeight: '600'
    },
    description: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px',
      lineHeight: '1.4'
    },
    packageDetails: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    tagsContainer: {
      marginBottom: '8px'
    },
    packageFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '8px',
      borderTop: '0.5px solid var(--tg-theme-hint-color, #708499)'
    },
    deadline: {
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    responses: {
      fontSize: '12px',
      color: 'var(--tg-theme-button-color, #5288c1)'
    },
    responseButton: {
      width: '100%',
      background: 'rgba(82, 136, 193, 0.1)',
      border: '0.5px solid var(--tg-theme-button-color, #5288c1)',
      borderRadius: '8px',
      padding: '8px',
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '14px',
      fontWeight: '500',
      marginTop: '8px',
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
      border: '0.5px solid var(--tg-theme-hint-color, #708499)',
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
      border: '0.5px solid var(--tg-theme-hint-color, #708499)',
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
      marginBottom: 8
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
      border: '0.5px solid var(--tg-theme-hint-color, #708499)',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 14
    },
    sendButton: {
      flex: 1,
      padding: 12,
      backgroundColor: 'var(--tg-theme-button-color, #5288c1)',
      color: 'var(--tg-theme-button-text-color, #ffffff)',
      border: 'none',
      borderRadius: 8,
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: 14
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>📦 Посылки</div>
        <div style={styles.subtitle}>Откликайтесь на посылки своими поездками</div>
      </div>

      {packages.map(pkg => (
        <div key={pkg.id} style={styles.packageCard}>
          <div style={styles.packageHeader}>
            <div style={styles.authorInfo}>
              <img src={pkg.authorAvatar} alt={pkg.author} style={styles.authorAvatar} />
              <div style={styles.authorName}>{pkg.author}</div>
            </div>
            <div style={styles.reward}>{pkg.reward}₽</div>
          </div>

          <div style={styles.route}>
            <span style={styles.routeFrom}>{pkg.from}</span>
            <span style={styles.routeArrow}>→</span>
            <span style={styles.routeTo}>{pkg.to}</span>
          </div>

          <div style={styles.description}>
            📦 {pkg.description}
          </div>

          <div style={styles.packageDetails}>
            <span>📏 {pkg.size === 'xs' ? 'XS (конверт)' : 
                      pkg.size === 's' ? 'S (книга)' : 
                      pkg.size === 'm' ? 'M (коробка обуви)' : 'L (чемодан)'}</span>
            <span>⚖️ {pkg.weight === 'light' ? 'До 0.5кг' : 
                       pkg.weight === 'medium' ? '0.5-2кг' : 
                       pkg.weight === 'heavy' ? '2-5кг' : '5-10кг'}</span>
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
            <div style={styles.deadline}>⏰ До {pkg.deadline}</div>
            <div style={styles.responses}>👥 {pkg.responses} откликов</div>
          </div>

          <button 
            style={styles.responseButton}
            onClick={() => handleResponseToPackage(pkg)}
          >
            ✈️ Отклиться своей поездкой
          </button>
        </div>
      ))}

      {/* Модальное окно отклика */}
      {showResponseForm && selectedPackage && (
        <div style={styles.modalOverlay} onClick={() => setShowResponseForm(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Отклик на посылку</h3>
              <button 
                style={styles.closeButton}
                onClick={() => setShowResponseForm(false)}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={{marginBottom: 16, fontSize: 14}}>
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
    </div>
  );
};

export default PackagesPage;