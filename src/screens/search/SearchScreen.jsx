import React, { useState } from 'react';
import RequestForm from '../../domains/package/components/RequestForm.jsx';

const SearchScreen = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  
  // Состояние для формы отправки посылки
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [useExistingPackage, setUseExistingPackage] = useState(false);
  const [requestForm, setRequestForm] = useState({
    packageDescription: '',
    size: '',
    weight: '',
    tags: [],
    pickupAddress: '',
    deliveryAddress: '',
    reward: 1000,
    message: ''
  });
  
  // Заглушки для существующих посылок пользователя
  const [myPackages] = useState([
    {
      id: 1,
      from: 'Москва',
      to: 'Дубай',
      description: 'Документы для визы',
      reward: 1500,
      size: 'xs',
      weight: 'light',
      tags: ['documents', 'urgent']
    },
    {
      id: 2,
      from: 'Москва',
      to: 'Стамбул',
      description: 'Подарок другу',
      reward: 800,
      size: 's',
      weight: 'medium',
      tags: ['fragile']
    }
  ]);

  const cities = [
    'Москва', 'Санкт-Петербург', 'Дубай', 'Стамбул', 'Тбилиси', 
    'Екатеринбург', 'Казань', 'Новосибирск', 'Самара', 'Ростов-на-Дону',
    'Краснодар', 'Сочи', 'Калининград', 'Минск', 'Алматы', 'Ташкент'
  ];

  const getSuggestions = (input) => {
    if (!input) return [];
    return cities.filter(city => 
      city.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
  };

  // Функция для обработки отправки заявки
  const handleSendRequest = () => {
    console.log('Отправляем заявку:', {
      courier: selectedCourier,
      useExistingPackage,
      requestForm
    });
    // Здесь будет API вызов для отправки заявки
    alert('Заявка отправлена курьеру!');
    // Сбрасываем форму
    setRequestForm({
      packageDescription: '',
      size: '',
      weight: '',
      tags: [],
      pickupAddress: '',
      deliveryAddress: '',
      reward: 1000,
      message: ''
    });
  };

  // Функция для клика по карточке курьера
  const handleCourierClick = (courier) => {
    setSelectedCourier(courier);
    setShowRequestForm(true);
  };

  const handleSearch = () => {
    const mockResults = [
      {
        id: 1,
        name: 'Ахмед',
        avatar: 'https://i.pravatar.cc/100?img=12',
        from: 'Москва',
        to: 'Дубай',
        date: '2025-01-15',
        time: '15:00 → 23:30',
        airport: 'Шереметьево → DXB',
        price: 1500,
        rating: 4.9,
        trips_count: 47,
        comment: 'Регулярные рейсы в Дубай, могу взять документы и небольшие посылки'
      },
      {
        id: 2,
        name: 'Фатима',
        avatar: 'https://i.pravatar.cc/100?img=44',
        from: 'Москва',
        to: 'Дубай',
        date: '2025-01-16',
        time: '09:30 → 17:45',
        airport: 'Внуково → DXB',
        price: 2000,
        rating: 4.8,
        trips_count: 28,
        comment: 'Утренний рейс, удобно для срочных доставок. Премиум сервис'
      },
      {
        id: 3,
        name: 'Марк',
        avatar: 'https://i.pravatar.cc/100?img=68',
        from: 'Москва',
        to: 'Дубай',
        date: '2025-01-17',
        time: '22:00 → 06:15',
        airport: 'Домодедово → DXB',
        price: 1200,
        rating: 4.6,
        trips_count: 15,
        comment: 'Ночной рейс, выгодные цены. Только документы и мелкие вещи'
      }
    ];
    setResults(mockResults);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    return stars.join('');
  };

  const renderAirportRoute = (airport) => {
    const parts = airport.split(' → ');
    if (parts.length === 2) {
      return (
        <>
          <span style={styles.airportFrom}>{parts[0]}</span>
          <span style={styles.airportArrow}>→</span>
          <span style={styles.airportTo}>{parts[1]}</span>
        </>
      );
    }
    return airport;
  };

  const styles = {
    container: {
      padding: '12px 16px 16px',
      background: 'linear-gradient(135deg, var(--tg-theme-bg-color, #17212b) 0%, rgba(23, 33, 43, 0.95) 100%)',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      padding: '16px 0'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--tg-theme-text-color, #ffffff), var(--tg-theme-accent-text-color, #64b5ef))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '6px'
    },
    subtitle: {
      fontSize: '14px',
      color: 'var(--tg-theme-hint-color, #708499)',
      opacity: 0.8
    },
    searchForm: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    inputRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px'
    },
    input: {
      flex: 1,
      padding: '14px 16px',
      background: 'var(--tg-theme-bg-color, #17212b)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    inputContainer: {
      position: 'relative',
      flex: 1
    },
    suggestions: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      marginTop: '8px',
      zIndex: 10,
      maxHeight: '200px',
      overflowY: 'auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
    },
    suggestion: {
      padding: '14px 20px',
      cursor: 'pointer',
      fontSize: '15px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        background: 'var(--tg-theme-button-color, #5288c1)'
      }
    },
    searchButton: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(82, 136, 193, 0.3)'
    },
    courierCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
        borderColor: 'var(--tg-theme-button-color, #5288c1)'
      }
    },
    courierHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    courierInfo: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px'
    },
    courierAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid var(--tg-theme-button-color, #5288c1)'
    },
    courierTextInfo: {
      flex: 1
    },
    courierName: {
      fontSize: '20px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '6px'
    },
    courierStats: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    price: {
      fontSize: '20px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, var(--tg-theme-accent-text-color, #64b5ef), var(--tg-theme-button-color, #5288c1))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    route: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    routeFrom: {
      fontWeight: '600'
    },
    routeArrow: {
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '20px',
      fontWeight: '700'
    },
    routeTo: {
      fontWeight: '600'
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      fontSize: '15px',
      color: 'var(--tg-theme-hint-color, #708499)',
      marginBottom: '16px'
    },
    airportRoute: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    airportText: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    airportFrom: {
      fontWeight: '500'
    },
    airportArrow: {
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '14px',
      fontWeight: '700',
      margin: '0 2px'
    },
    airportTo: {
      fontWeight: '500'
    },
    comment: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      background: 'rgba(100, 181, 239, 0.1)',
      padding: '12px 16px',
      borderRadius: '12px',
      fontStyle: 'italic',
      border: '1px solid rgba(100, 181, 239, 0.2)'
    },
    clickHint: {
      textAlign: 'center',
      padding: '16px',
      background: 'linear-gradient(135deg, rgba(82, 136, 193, 0.1), rgba(100, 181, 239, 0.1))',
      borderTop: '1px solid rgba(82, 136, 193, 0.2)',
      color: 'var(--tg-theme-button-color, #5288c1)',
      fontSize: '15px',
      fontWeight: '500',
      marginTop: '12px',
      borderRadius: '0 0 20px 20px',
      marginBottom: '-20px',
      marginLeft: '-20px',
      marginRight: '-20px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px',
      opacity: 0.6
    },
    emptyText: {
      fontSize: '18px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.searchForm}>
        <div style={styles.inputRow}>
          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              type="text"
              placeholder="Откуда"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setShowFromSuggestions(true);
              }}
              onFocus={() => setShowFromSuggestions(true)}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
            />
            {showFromSuggestions && getSuggestions(from).length > 0 && (
              <div style={styles.suggestions}>
                {getSuggestions(from).map((city, index) => (
                  <div
                    key={index}
                    style={styles.suggestion}
                    onMouseDown={() => {
                      setFrom(city);
                      setShowFromSuggestions(false);
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              type="text"
              placeholder="Куда"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setShowToSuggestions(true);
              }}
              onFocus={() => setShowToSuggestions(true)}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
            />
            {showToSuggestions && getSuggestions(to).length > 0 && (
              <div style={styles.suggestions}>
                {getSuggestions(to).map((city, index) => (
                  <div
                    key={index}
                    style={styles.suggestion}
                    onMouseDown={() => {
                      setTo(city);
                      setShowToSuggestions(false);
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button style={styles.searchButton} onClick={handleSearch}>
          📦 Передать посылку
        </button>
      </div>

      {results.length === 0 && from && to && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <div style={styles.emptyText}>Выполните поиск для передачи посылки</div>
        </div>
      )}

      {results.map(courier => (
        <div 
          key={courier.id} 
          style={styles.courierCard}
          onClick={() => handleCourierClick(courier)}
        >
          <div style={styles.courierHeader}>
            <div style={styles.courierInfo}>
              <img 
                src={courier.avatar} 
                alt={courier.name}
                style={styles.courierAvatar}
              />
              <div style={styles.courierTextInfo}>
                <div style={styles.courierName}>{courier.name}</div>
                <div style={styles.courierStats}>
                  {renderStars(courier.rating)} {courier.rating} • {courier.trips_count} поездок
                </div>
              </div>
            </div>
            <div style={styles.price}>{courier.price}₽</div>
          </div>
          
          <div style={styles.route}>
            <span style={styles.routeFrom}>{courier.from}</span>
            <span style={styles.routeArrow}>→</span>
            <span style={styles.routeTo}>{courier.to}</span>
          </div>
          
          <div style={styles.details}>
            <div style={styles.airportRoute}>
              🛫 <span style={styles.airportText}>{renderAirportRoute(courier.airport)}</span>
            </div>
            <div>🕐 {courier.date} в {courier.time}</div>
          </div>
          
          {courier.comment && (
            <div style={styles.comment}>
              💬 {courier.comment}
            </div>
          )}
          
          <div style={styles.clickHint}>
            📦 Нажмите чтобы отправить посылку
          </div>
        </div>
      ))}

      <RequestForm
        selectedCourier={selectedCourier}
        showRequestForm={showRequestForm}
        setShowRequestForm={setShowRequestForm}
        requestForm={requestForm}
        setRequestForm={setRequestForm}
        handleSendRequest={handleSendRequest}
        myPackages={myPackages}
        useExistingPackage={useExistingPackage}
        setUseExistingPackage={setUseExistingPackage}
      />
    </div>
  );
};

export default SearchScreen;