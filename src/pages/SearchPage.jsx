import React, { useState, useEffect } from 'react';
import { useAppContext } from '../shared/context/AppContext.jsx';
import { theme, layoutStyles } from '../shared/context/DesignSystem';
import { useSearchState } from '../shared/hooks/useSearchState';
import { useCourierSearch, usePackageActions } from '../hooks/useApi';
import { sortCouriers } from '../utils/courierUtils';

// Components
import SearchForm from '../domains/courier/components/SearchForm';
import CourierCard from '../domains/courier/components/CourierCard';
import SortMenu from '../domains/courier/components/SortMenu';
import CourierModal from '../domains/courier/components/CourierModal';
import RequestForm from '../domains/package/components/RequestForm';
import AddTripForm from '../domains/user/components/AddTripForm';

const SearchPage = () => {
  const { 
    searchCollapsed, 
    setSearchCollapsed,
    modal,
    openModal,
    closeModal,
    selectCourier
  } = useAppContext();
  
  const { couriers, searchCouriers, loading: couriersLoading } = useCourierSearch();
  const { createTrip } = usePackageActions();
  
  const searchState = useSearchState(couriers);
  const {
    from,
    to,
    results,
    searchPerformed,
    dateFrom,
    dateTo,
    showDatePicker,
    sortBy,
    showSortMenu,
    availableCities,
    setFrom,
    setTo,
    setResults,
    setSearchPerformed,
    setDateFrom,
    setDateTo,
    setShowDatePicker,
    setSortBy,
    setShowSortMenu,
    clearFromCity,
    clearToCity,
    getDatePresets,
    getDateRangeLabel
  } = searchState;
  
  // UI state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sentRequests] = useState([]);
  const [requestForm, setRequestForm] = useState({
    message: '',
    reward: 800,
    packageDescription: '',
    size: '',
    weight: '',
    tags: [],
    pickupAddress: '',
    deliveryAddress: ''
  });
  const [useExistingPackage, setUseExistingPackage] = useState(false);
  
  // Search functionality
  const handleSearch = async () => {
    try {
      const searchParams = {
        from: from.trim(),
        to: to.trim(),
        date_from: dateFrom,
        date_to: dateTo
      };
      
      const searchResults = await searchCouriers(searchParams);
      let filtered = searchResults;

      // Hide departed couriers
      const now = new Date();
      filtered = filtered.filter(c => {
        const [time] = c.time.split(' → ');
        const departureDateTime = new Date(`${c.date}T${time}:00`);
        return departureDateTime > now;
      });

      // Date range filtering
      if (dateFrom) {
        filtered = filtered.filter(c => c.date >= dateFrom);
      }
      if (dateTo) {
        filtered = filtered.filter(c => c.date <= dateTo);
      }

      // Separate pending requests and other couriers
      const pendingRequests = filtered.filter(c => getRequestStatus(c) === 'pending');
      const otherCouriers = filtered.filter(c => getRequestStatus(c) !== 'pending');

      // Sort each group
      const sortGroup = (couriers) => couriers.sort((a, b) => {
        const getDateTime = (courier) => {
          const [time] = courier.time.split(' → ');
          return new Date(`${courier.date}T${time}:00`);
        };
        
        const dateTimeA = getDateTime(a);
        const dateTimeB = getDateTime(b);
        
        if (sortBy === 'time') {
          return dateTimeA - dateTimeB;
        } else {
          return sortCouriers([a, b], sortBy)[0] === a ? -1 : 1;
        }
      });

      // Combine: normal couriers first, then pending ones
      const sorted = [...sortGroup(otherCouriers), ...sortGroup(pendingRequests)];

      setResults(sorted);
      setSearchPerformed(true);
      if (sorted.length > 0) {
        setSearchCollapsed(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  };
  
  // Request management
  const getRequestStatus = (courier) => {
    const request = sentRequests.find(req => req.courierId === courier.name + courier.date);
    return request ? request.status : null;
  };

  const isRequestSent = (courier) => {
    return sentRequests.some(req => req.courierId === courier.name + courier.date);
  };
  
  const handleCourierClick = (courier) => {
    selectCourier(courier);
  };
  
  const scrollToSearch = () => {
    setSearchCollapsed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleNotifyWhenAvailable = () => {
    // Simplified confetti without blocking main thread
    setTimeout(() => {
      alert('🎉 Отлично! Мы уведомим вас, как только кто-то создаст подходящий маршрут в ближайший месяц!');
    }, 100);
  };
  
  const getTimeUntilDeparture = (date, time) => {
    const [startTime] = time.split(' → ');
    const departureDateTime = new Date(`${date}T${startTime}:00`);
    const now = currentTime;
    const timeDiff = departureDateTime - now;

    if (timeDiff <= 0) return 'Вылетел';

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} дн ${hours} ч`;
    return `${hours} ч`;
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Ожидание ответа';
      case 'accepted': return 'Принята';
      case 'declined': return 'Отказано';
      default: return '';
    }
  };

  const getStatusStyle = (status) => ({
    padding: '4px 8px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 500,
    backgroundColor: status === 'accepted' ? theme.colors.success : 
                    status === 'declined' ? theme.colors.danger : 
                    theme.colors.warning,
    color: status === 'pending' ? '#1a1a1a' : 'white'
  });
  
  const handleAddTrip = async (tripData) => {
    try {
      const newTripData = {
        name: 'Никита',
        from: tripData.from,
        to: tripData.to,
        date: tripData.date,
        time: tripData.time,
        airport: tripData.transportDetails,
        price: tripData.price,
        comment: tripData.comment,
        transportType: tripData.transportType,
        capacity: tripData.capacity
      };
      
      await createTrip(newTripData);
      closeModal();
    } catch (error) {
      console.error('Trip creation error:', error);
    }
  };
  
  // Effects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortMenu && !event.target.closest('.compact-sort-section')) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortMenu]);
  
  // Styles
  const styles = {
    compactHeader: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: theme.colors.secondaryBg,
      backdropFilter: 'blur(20px)',
      borderBottom: `0.5px solid ${theme.colors.hint}`,
      padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
      zIndex: theme.zIndex.header,
      animation: 'slideIn 0.3s ease-out'
    },
    compactHeaderContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '100%',
      margin: '0 auto'
    },
    compactLogo: {
      fontSize: theme.fontSize.xxl,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.accent,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    },
    routeDisplay: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.medium,
      color: theme.colors.text,
      textAlign: 'center',
      flex: 1,
      margin: `0 ${theme.spacing.md}px`
    },
    editSearchButton: {
      background: theme.colors.button,
      color: theme.colors.buttonText,
      border: 'none',
      borderRadius: theme.borderRadius.sm,
      padding: '6px 12px',
      fontSize: theme.fontSize.sm,
      fontWeight: theme.fontWeight.medium,
      cursor: 'pointer',
      transition: theme.transitions.fast
    },
    backToTopButton: {
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: theme.colors.button,
      color: theme.colors.buttonText,
      border: 'none',
      borderRadius: theme.borderRadius.round,
      width: 44,
      height: 44,
      fontSize: theme.fontSize.xxl,
      cursor: 'pointer',
      boxShadow: theme.shadows.md,
      zIndex: theme.zIndex.modal,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };
  
  return (
    <div style={{...layoutStyles.page, paddingBottom: 80}}>
      {/* Compact header for results */}
      {searchCollapsed && (
        <div style={styles.compactHeader}>
          <div style={styles.compactHeaderContent}>
            <div style={styles.compactLogo}>
              <div style={{
                width: 20, 
                height: 20, 
                background: `linear-gradient(135deg, ${theme.colors.button}, ${theme.colors.accent})`,
                borderRadius: theme.borderRadius.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}>📦</div>
              PeerPack
            </div>
            <div style={styles.routeDisplay}>{from} → {to}</div>
            <button 
              style={styles.editSearchButton}
              onClick={scrollToSearch}
            >
              Изменить
            </button>
          </div>
        </div>
      )}
      
      {!searchCollapsed && (
        <SearchForm
          from={from}
          setFrom={(value) => {
            setFrom(value);
            if (results.length > 0) {
              setResults([]);
              setSearchCollapsed(false);
            }
          }}
          to={to}
          setTo={(value) => {
            setTo(value);
            if (results.length > 0) {
              setResults([]);
              setSearchCollapsed(false);
            }
          }}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          availableCities={availableCities}
          handleSearch={handleSearch}
          clearFromCity={clearFromCity}
          clearToCity={clearToCity}
          getDatePresets={getDatePresets}
          getDateRangeLabel={getDateRangeLabel}
        />
      )}

      <SortMenu
        results={results}
        setResults={setResults}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showSortMenu={showSortMenu}
        setShowSortMenu={setShowSortMenu}
      />

      <div style={{ 
        width: '100%', 
        maxWidth: 480, 
        marginTop: results.length > 0 ? (searchCollapsed ? 0 : theme.spacing.lg) : 30,
        paddingTop: searchCollapsed ? 60 : 0
      }}>
        {couriersLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: theme.spacing.md
          }}>
            <div style={{
              width: 40,
              height: 40,
              border: `3px solid ${theme.colors.hint}`,
              borderTop: `3px solid ${theme.colors.button}`,
              borderRadius: theme.borderRadius.round,
              animation: 'spin 1s linear infinite'
            }}></div>
            <div style={{
              color: theme.colors.hint,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.medium
            }}>
              Поиск курьеров...
            </div>
          </div>
        ) : results.length === 0 && searchPerformed ? (
          <div style={{ 
            textAlign: 'center',
            color: theme.colors.hint,
            fontSize: theme.fontSize.lg,
            padding: '40px 20px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              Курьеры не найдены
            </div>
            <button 
              onClick={handleNotifyWhenAvailable}
              style={{
                backgroundColor: theme.colors.button,
                color: theme.colors.buttonText,
                border: 'none',
                borderRadius: theme.borderRadius.sm,
                padding: '10px 16px',
                fontSize: theme.fontSize.md,
                cursor: 'pointer',
                transition: theme.transitions.fast
              }}
            >
              Уведомить о поездке
            </button>
          </div>
        ) : results.map((courier, index) => (
          <CourierCard
            key={courier.name + courier.date}
            courier={courier}
            index={index}
            onClick={handleCourierClick}
            getRequestStatus={getRequestStatus}
            getStatusStyle={getStatusStyle}
            getStatusText={getStatusText}
            getTimeUntilDeparture={getTimeUntilDeparture}
          />
        ))}
      </div>

      <div style={{ 
        marginTop: theme.spacing.xl, 
        marginBottom: theme.spacing.xl,
        textAlign: 'center' 
      }}>
        <button 
          style={{
            background: 'transparent',
            color: theme.colors.link,
            border: 'none',
            fontSize: theme.fontSize.lg,
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: theme.fontWeight.medium
          }}
          onClick={() => openModal('add-trip')}
        >
          Близится поездка? Заработайте на ней!
        </button>
      </div>
      
      {/* Modals */}
      <CourierModal
        selectedCourier={modal.data}
        showModal={modal.isOpen && modal.type === 'courier'}
        setShowModal={closeModal}
        getRequestStatus={getRequestStatus}
        getStatusStyle={getStatusStyle}
        getStatusText={getStatusText}
        sentRequests={sentRequests}
        isRequestSent={isRequestSent}
        setShowRequestForm={() => openModal('request-form', modal.data)}
      />

      <RequestForm
        selectedCourier={modal.data}
        showRequestForm={modal.isOpen && modal.type === 'request-form'}
        setShowRequestForm={closeModal}
        requestForm={requestForm}
        setRequestForm={setRequestForm}
        handleSendRequest={() => {}} // TODO: implement
        myPackages={[]} // TODO: get from context
        useExistingPackage={useExistingPackage}
        setUseExistingPackage={setUseExistingPackage}
      />

      <AddTripForm
        showAddTripForm={modal.isOpen && modal.type === 'add-trip'}
        setShowAddTripForm={closeModal}
        onAddTrip={handleAddTrip}
        availableCities={availableCities}
      />

      {showBackToTop && (
        <button
          style={styles.backToTopButton}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default SearchPage;