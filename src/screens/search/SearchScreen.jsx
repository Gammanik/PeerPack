import React, { useState, useEffect } from 'react';
import RequestForm from '../../domains/package/components/RequestForm.jsx';
import { useLocale } from '../../contexts/LanguageContext.jsx';

const SearchScreen = () => {
  const { t, getCities } = useLocale();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  
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

  const cityData = getCities();
  const cities = cityData.map(city => city.local);

  const getSuggestions = (input) => {
    if (!input) return [];
    return cityData.filter(city => 
      city.local.toLowerCase().includes(input.toLowerCase()) ||
      city.english.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
  };

  const clearFromCity = () => {
    setFrom('');
    setResults([]);
    setSearchStarted(false);
  };

  const clearToCity = () => {
    setTo('');
    setResults([]);
    setSearchStarted(false);
  };

  // Функция для обработки отправки заявки
  const handleSendRequest = () => {
    console.log('Отправляем заявку:', {
      courier: selectedCourier,
      useExistingPackage,
      requestForm
    });
    // Здесь будет API вызов для отправки заявки
    alert(t('requestSent'));
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

  const handleSearch = async () => {
    if (!from || !to) return;
    
    setIsLoading(true);
    setSearchStarted(true);
    setResults([]);
    
    // Имитация задержки API запроса
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const mockResults = [
      {
        id: 1,
        name: 'Ахмед',
        avatar: 'https://i.pravatar.cc/100?img=12',
        from: from || 'Москва',
        to: to || 'Дубай',
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
        from: from || 'Москва',
        to: to || 'Дубай',
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
        from: from || 'Москва',
        to: to || 'Дубай',
        date: '2025-01-17',
        time: '22:00 → 06:15',
        airport: 'Домодедово → DXB',
        price: 1200,
        rating: 4.6,
        trips_count: 15,
        comment: 'Ночной рейс, выгодные цены. Только документы и мелкие вещи'
      }
    ];
    
    setIsLoading(false);
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

  const isVeryNarrow = screenWidth < 400;
  const isMobile = screenWidth < 480;

  // Добавляем CSS анимации в head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const styles = {
    container: {
      padding: isVeryNarrow ? '4px 8px 16px' : '8px 12px 16px',
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
      borderRadius: isVeryNarrow ? '8px' : '12px',
      padding: isVeryNarrow ? '8px' : isMobile ? '12px' : '16px',
      marginBottom: '16px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    inputRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: isVeryNarrow ? '4px' : isMobile ? '6px' : '8px',
      marginBottom: '16px',
      width: '100%',
      boxSizing: 'border-box'
    },
    input: {
      width: '100%',
      padding: isVeryNarrow ? '8px 6px' : isMobile ? '10px 8px' : '12px 12px',
      background: 'var(--tg-theme-bg-color, #17212b)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: isVeryNarrow ? '6px' : isMobile ? '8px' : '10px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      fontSize: isVeryNarrow ? '13px' : isMobile ? '14px' : '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      minHeight: isVeryNarrow ? '32px' : isMobile ? '36px' : '40px',
      boxSizing: 'border-box',
      maxWidth: '100%'
    },
    inputContainer: {
      position: 'relative'
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
      padding: isVeryNarrow ? '10px' : isMobile ? '12px' : '14px',
      background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
      color: 'white',
      border: 'none',
      borderRadius: isVeryNarrow ? '8px' : '12px',
      fontSize: isVeryNarrow ? '14px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(82, 136, 193, 0.3)',
      minHeight: isVeryNarrow ? '36px' : isMobile ? '40px' : '44px',
      boxSizing: 'border-box'
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
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '40px 20px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      margin: '0 auto 20px',
      border: '3px solid rgba(82, 136, 193, 0.2)',
      borderTop: '3px solid var(--tg-theme-button-color, #5288c1)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loadingText: {
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '8px',
      color: 'var(--tg-theme-text-color, #ffffff)'
    },
    loadingSubtext: {
      fontSize: '14px',
      opacity: 0.7
    },
    skeletonCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      animation: 'pulse 1.5s ease-in-out infinite'
    },
    skeletonLine: {
      height: '12px',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
      borderRadius: '6px',
      marginBottom: '8px',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite'
    },
    skeletonAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite'
    },
    fadeIn: {
      animation: 'fadeIn 0.5s ease-out'
    }
  };

  // Компонент скелетон карточки
  const SkeletonCard = () => (
    <div style={styles.skeletonCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={styles.skeletonAvatar}></div>
          <div style={{ flex: 1 }}>
            <div style={{ ...styles.skeletonLine, width: '120px', height: '16px', marginBottom: '8px' }}></div>
            <div style={{ ...styles.skeletonLine, width: '80px', height: '12px' }}></div>
          </div>
        </div>
        <div style={{ ...styles.skeletonLine, width: '60px', height: '20px' }}></div>
      </div>
      <div style={{ ...styles.skeletonLine, width: '200px', height: '14px', marginBottom: '12px' }}></div>
      <div style={{ ...styles.skeletonLine, width: '150px', height: '12px', marginBottom: '8px' }}></div>
      <div style={{ ...styles.skeletonLine, width: '180px', height: '12px' }}></div>
    </div>
  );

  // Компонент загрузки
  const LoadingState = () => (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <div style={styles.loadingText}>Ищем курьеров...</div>
      <div style={styles.loadingSubtext}>Поиск может занять несколько секунд</div>
    </div>
  );

  return (
    <div style={styles.container}>

      <div style={styles.searchForm}>
        <div style={styles.inputRow}>
          <div style={{
            ...styles.inputContainer,
            flex: '1 1 0',
            minWidth: 0,
            maxWidth: `calc(50% - ${isVeryNarrow ? '16px' : isMobile ? '18px' : '20px'})`
          }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                style={{
                  ...styles.input,
                  paddingRight: from ? '32px' : '12px'
                }}
                type="text"
                placeholder={t('fromLabel')}
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setShowFromSuggestions(true);
                }}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              />
              {from && (
                <button
                  style={{
                    position: 'absolute',
                    right: isVeryNarrow ? '4px' : '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'var(--tg-theme-hint-color, #708499)',
                    border: 'none',
                    borderRadius: '50%',
                    width: isVeryNarrow ? '18px' : '20px',
                    height: isVeryNarrow ? '18px' : '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: isVeryNarrow ? '10px' : '12px',
                    color: 'var(--tg-theme-bg-color, #17212b)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={clearFromCity}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--tg-theme-text-color, #ffffff)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--tg-theme-hint-color, #708499)';
                  }}
                >
                  ×
                </button>
              )}
            </div>
            {showFromSuggestions && getSuggestions(from).length > 0 && (
              <div style={styles.suggestions}>
                {getSuggestions(from).map((city, index) => (
                  <div
                    key={index}
                    style={styles.suggestion}
                    onMouseDown={() => {
                      setFrom(city.local);
                      setShowFromSuggestions(false);
                    }}
                  >
                    {city.local}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Кнопка обмена местами */}
          <div style={{ paddingBottom: '2px', flexShrink: 0 }}>
            <button
              style={{
                background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--tg-theme-hint-color, #708499)',
                fontSize: isVeryNarrow ? '12px' : isMobile ? '14px' : '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: 0,
                lineHeight: 1,
                width: isVeryNarrow ? '28px' : isMobile ? '32px' : '40px',
                height: isVeryNarrow ? '28px' : isMobile ? '32px' : '40px',
                borderRadius: isVeryNarrow ? '6px' : isMobile ? '8px' : '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              onClick={() => {
                const tempFrom = from;
                setFrom(to);
                setTo(tempFrom);
              }}
              title="Поменять местами"
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--tg-theme-button-color, #5288c1)';
                e.target.style.color = 'var(--tg-theme-button-text-color, #ffffff)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--tg-theme-secondary-bg-color, #232e3c)';
                e.target.style.color = 'var(--tg-theme-hint-color, #708499)';
              }}
            >
              ⇅
            </button>
          </div>
          
          <div style={{
            ...styles.inputContainer,
            flex: '1 1 0',
            minWidth: 0,
            maxWidth: `calc(50% - ${isVeryNarrow ? '16px' : isMobile ? '18px' : '20px'})`
          }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                style={{
                  ...styles.input,
                  paddingRight: to ? '32px' : '12px'
                }}
                type="text"
                placeholder={t('toLabel')}
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setShowToSuggestions(true);
                }}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              />
              {to && (
                <button
                  style={{
                    position: 'absolute',
                    right: isVeryNarrow ? '4px' : '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'var(--tg-theme-hint-color, #708499)',
                    border: 'none',
                    borderRadius: '50%',
                    width: isVeryNarrow ? '18px' : '20px',
                    height: isVeryNarrow ? '18px' : '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: isVeryNarrow ? '10px' : '12px',
                    color: 'var(--tg-theme-bg-color, #17212b)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={clearToCity}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--tg-theme-text-color, #ffffff)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--tg-theme-hint-color, #708499)';
                  }}
                >
                  ×
                </button>
              )}
            </div>
            {showToSuggestions && getSuggestions(to).length > 0 && (
              <div style={styles.suggestions}>
                {getSuggestions(to).map((city, index) => (
                  <div
                    key={index}
                    style={styles.suggestion}
                    onMouseDown={() => {
                      setTo(city.local);
                      setShowToSuggestions(false);
                    }}
                  >
                    {city.local}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button 
          style={{
            ...styles.searchButton,
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }} 
          onClick={handleSearch}
          disabled={isLoading || !from || !to}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid #ffffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '8px'
              }}></div>
              Поиск...
            </>
          ) : (
            <>
              📦 {t('sendPackage')}
            </>
          )}
        </button>
      </div>

      {/* Показываем загрузку */}
      {isLoading && (
        <>
          <LoadingState />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}

      {/* Показываем пустое состояние если поиск был запущен, но нет результатов */}
      {!isLoading && searchStarted && results.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <div style={styles.emptyText}>Курьеры не найдены</div>
          <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
            Попробуйте изменить параметры поиска
          </div>
        </div>
      )}

      {/* Показываем начальное состояние */}
      {!isLoading && !searchStarted && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <div style={styles.emptyText}>{t('performSearch')}</div>
        </div>
      )}

      {/* Показываем результаты с анимацией */}
      {!isLoading && results.length > 0 && results.map((courier, index) => (
        <div 
          key={courier.id} 
          style={{
            ...styles.courierCard,
            ...styles.fadeIn,
            animationDelay: `${index * 0.1}s`
          }}
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
                  {renderStars(courier.rating)} {courier.rating} • {courier.trips_count} {t('trips')}
                </div>
              </div>
            </div>
            <div style={styles.price}>{courier.price}{t('rub')}</div>
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
            📦 {t('clickToSend')}
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