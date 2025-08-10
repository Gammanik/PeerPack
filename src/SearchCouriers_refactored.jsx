import React, { useState, useEffect } from 'react';
import { injectCSS } from './styles/CourierAnimations';
import { couriers } from './data/mockData';
import { sortCouriers, getAvailableCities, renderStars } from './utils/courierUtils';
import SearchForm from './components/SearchForm';
import CourierCard from './components/CourierCard';
import SortMenu from './components/SortMenu';
import CourierModal from './components/CourierModal';
import RequestForm from './components/RequestForm';
import AboutPage from './components/AboutPage';

const SearchCouriers = () => {
    const [from, setFrom] = useState('Москва');
    const [to, setTo] = useState('Санкт-Петербург');
    const [results, setResults] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [sortBy, setSortBy] = useState('time');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [searchCollapsed, setSearchCollapsed] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showAboutPage, setShowAboutPage] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({
        trips: 0,
        rating: 0,
        couriers: 0,
        totalTrips: 0
    });
    const [currentTime, setCurrentTime] = useState(new Date());
    const [mode, setMode] = useState('search');
    const [newTrip, setNewTrip] = useState({
        name: '',
        from: '',
        to: '',
        date: '',
        time: '',
        airport: ''
    });
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [sentRequests, setSentRequests] = useState([]);
    const [requestForm, setRequestForm] = useState({
        message: '',
        reward: 5,
        packageDescription: ''
    });

    const availableCities = getAvailableCities(couriers);

    // Search functionality
    const handleSearch = () => {
        const lowerFrom = from.trim().toLowerCase();
        const lowerTo = to.trim().toLowerCase();
        let filtered = couriers.filter((c) =>
            c.from.toLowerCase() === lowerFrom &&
            c.to.toLowerCase() === lowerTo
        );

        if (selectedDate) {
            filtered = filtered.filter(c => c.date === selectedDate);
        }

        const sorted = sortCouriers(filtered, sortBy);
        setResults(sorted);
        if (sorted.length > 0) {
            setSearchCollapsed(true);
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

    const handleSendRequest = () => {
        if (selectedCourier) {
            const newRequest = {
                id: Date.now(),
                courierId: selectedCourier.name + selectedCourier.date,
                status: 'pending',
                timestamp: Date.now(),
                courierName: selectedCourier.name,
                route: `${selectedCourier.from} → ${selectedCourier.to}`,
                date: selectedCourier.date,
                message: requestForm.message,
                reward: requestForm.reward,
                packageDescription: requestForm.packageDescription,
            };
            setSentRequests([...sentRequests, newRequest]);
            setRequestForm({ message: '', reward: 5, packageDescription: '' });
        }
    };

    const simulateStatusChange = () => {
        setSentRequests(prev => prev.map(req => {
            if (req.status === 'pending' && Math.random() > 0.7) {
                const statuses = ['accepted', 'declined'];
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const comments = {
                    'accepted': [
                        'Принимаю вашу заявку! Свяжусь с вами ближе к дате поездки.',
                        'Отлично! Буду рад помочь с доставкой.',
                        'Заявка принята. Все детали обсудим позже.'
                    ],
                    'declined': [
                        'К сожалению, у меня не будет места для вашей посылки.',
                        'Извините, но я не смогу взять вашу посылку в этот раз.',
                        'Не получится помочь с доставкой, извините.'
                    ]
                };
                return {
                    ...req,
                    status: newStatus,
                    courierComment: comments[newStatus][Math.floor(Math.random() * comments[newStatus].length)]
                };
            }
            return req;
        }));
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
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: status === 'accepted' ? 'rgba(76, 175, 80, 0.1)' : 
                        status === 'declined' ? 'rgba(244, 67, 54, 0.1)' : 
                        'rgba(255, 193, 7, 0.1)',
        color: status === 'accepted' ? '#4CAF50' : 
               status === 'declined' ? '#F44336' : 
               '#FFC107'
    });

    // Utility functions
    const clearFromCity = () => setFrom('');
    const clearToCity = () => setTo('');

    const handleCourierClick = (courier) => {
        setSelectedCourier(courier);
        setShowModal(true);
    };

    const scrollToSearch = () => {
        setSearchCollapsed(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const getDatePresets = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return [
            { label: 'Сегодня', value: today.toISOString().split('T')[0] },
            { label: 'Завтра', value: tomorrow.toISOString().split('T')[0] },
            { label: 'Послезавтра', value: dayAfterTomorrow.toISOString().split('T')[0] },
            { label: 'Через неделю', value: nextWeek.toISOString().split('T')[0] },
        ];
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            weekday: 'short'
        });
    };

    const handleAddTrip = () => {
        if (newTrip.name && newTrip.from && newTrip.to && newTrip.date && newTrip.time && newTrip.airport) {
            const tripToAdd = {
                ...newTrip,
                avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`,
                tripsCount: 1,
                rating: 5.0,
                reviewsCount: 0,
                price: Math.floor(Math.random() * 1000) + 500,
                tripComment: 'Новый курьер на платформе',
                pastTrips: [],
                reviews: []
            };
            couriers.push(tripToAdd);
            setNewTrip({
                name: '',
                from: '',
                to: '',
                date: '',
                time: '',
                airport: ''
            });
            setMode('search');
        }
    };

    // Effects
    useEffect(() => {
        injectCSS();
        
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(simulateStatusChange, 10000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimatedStats(prev => ({
                trips: Math.min(prev.trips + Math.floor(Math.random() * 50) + 10, 15247),
                rating: Math.min(prev.rating + 0.01, 4.8),
                couriers: Math.min(prev.couriers + Math.floor(Math.random() * 5) + 1, 1892),
                totalTrips: Math.min(prev.totalTrips + Math.floor(Math.random() * 100) + 20, 89453)
            }));
        }, 100);

        return () => clearInterval(interval);
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

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const styles = {
        page: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'padding-top 0.3s ease',
            position: 'relative'
        },
        compactHeader: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(42, 42, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #3a3a3a',
            padding: '12px 20px',
            zIndex: 100,
            animation: 'slideIn 0.3s ease-out'
        },
        compactHeaderContent: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 400,
            margin: '0 auto'
        },
        compactLogo: {
            fontSize: 20,
            filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
        },
        routeDisplay: {
            fontSize: 16,
            fontWeight: 600,
            color: 'white'
        },
        editSearchButton: {
            background: 'rgba(0,191,166,0.15)',
            color: '#00bfa6',
            border: '1px solid rgba(0,191,166,0.3)',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        compactLogoSection: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20
        },
        compactLogoButton: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: 12,
            padding: '8px 16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        compactLogoIcon: {
            fontSize: 20,
            filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
        },
        compactBrandText: {
            fontSize: 16,
            fontWeight: 600,
            color: '#FFD700'
        }
    };

    return (
        <div style={{
            ...styles.page,
            paddingTop: searchCollapsed ? '80px' : '20px'
        }}>
            {/* Compact header for results */}
            {searchCollapsed && (
                <div style={styles.compactHeader}>
                    <div style={styles.compactHeaderContent}>
                        <div style={styles.compactLogo}>⚡</div>
                        <div style={styles.routeDisplay}>{from} → {to}</div>
                        <button 
                            className="edit-search-button"
                            style={styles.editSearchButton}
                            onClick={scrollToSearch}
                        >
                            изменить
                        </button>
                    </div>
                </div>
            )}
            
            {/* Compact logo */}
            {!searchCollapsed && !showAboutPage && (
                <div style={styles.compactLogoSection}>
                    <button 
                        style={styles.compactLogoButton}
                        onClick={() => setShowAboutPage(true)}
                        className="compact-logo-btn"
                    >
                        <span style={styles.compactLogoIcon}>⚡</span>
                        <span style={styles.compactBrandText}>PeerPack</span>
                    </button>
                </div>
            )}

            {showAboutPage ? (
                <AboutPage 
                    setShowAboutPage={setShowAboutPage}
                    animatedStats={animatedStats}
                />
            ) : mode === 'search' ? (
                <>
                    {!searchCollapsed && (
                        <SearchForm
                            from={from}
                            setFrom={setFrom}
                            to={to}
                            setTo={setTo}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            showDatePicker={showDatePicker}
                            setShowDatePicker={setShowDatePicker}
                            availableCities={availableCities}
                            handleSearch={handleSearch}
                            clearFromCity={clearFromCity}
                            clearToCity={clearToCity}
                            getDatePresets={getDatePresets}
                            formatDate={formatDate}
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

                    <div style={{ width: '100%', maxWidth: 400, marginTop: results.length > 0 ? 15 : 30 }}>
                        {results.length === 0 ? (
                            <p style={{ color: '#aaa', textAlign: 'center' }}>Доставщики не найдены.</p>
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

                    <div style={{ marginTop: 40, textAlign: 'center' }}>
                        <button 
                            style={{
                                background: 'transparent',
                                color: '#00bfa6',
                                border: 'none',
                                fontSize: 14,
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                            onClick={() => setMode('add')}
                        >
                            Вы доставщик? Добавить поездку
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div style={{ width: '100%', maxWidth: 400, marginBottom: 20 }}>
                        <button 
                            style={{
                                background: 'transparent',
                                color: '#aaa',
                                border: 'none',
                                fontSize: 14,
                                cursor: 'pointer'
                            }}
                            onClick={() => setMode('search')}
                        >
                            ← Назад к поиску курьеров
                        </button>
                    </div>
                    
                    <div style={{
                        background: '#2b2b2b',
                        padding: 20,
                        borderRadius: 16,
                        maxWidth: 400,
                        width: '100%',
                        boxShadow: '0 0 15px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{
                            color: 'white',
                            fontSize: 20,
                            fontWeight: 'bold',
                            margin: '0 0 20px 0',
                            textAlign: 'center'
                        }}>Добавить поездку</h3>
                        
                        {Object.keys(newTrip).map((field) => (
                            <div key={field} style={{ marginBottom: 15 }}>
                                <label style={{
                                    color: '#aaa',
                                    marginBottom: 5,
                                    display: 'block',
                                    fontSize: 14
                                }}>
                                    {field === 'name' ? 'Ваше имя' :
                                     field === 'from' ? 'Откуда' :
                                     field === 'to' ? 'Куда' :
                                     field === 'date' ? 'Дата' :
                                     field === 'time' ? 'Время вылета → прилета' :
                                     'Аэропорты'}
                                </label>
                                <input
                                    type={field === 'date' ? 'date' : 'text'}
                                    value={newTrip[field]}
                                    onChange={(e) => setNewTrip({...newTrip, [field]: e.target.value})}
                                    placeholder={field === 'name' ? 'Например, Анна' :
                                               field === 'from' ? 'Например, Москва' :
                                               field === 'to' ? 'Например, Сочи' :
                                               field === 'time' ? 'Например, 15:00 → 17:30' :
                                               field === 'airport' ? 'Например, Внуково → Адлер' : ''}
                                    style={{
                                        padding: 14,
                                        width: '100%',
                                        background: '#1c1c1c',
                                        border: '1px solid #3a3a3a',
                                        borderRadius: 12,
                                        color: 'white',
                                        fontSize: 15,
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        ))}
                        
                        <button 
                            style={{
                                marginTop: 20,
                                padding: 12,
                                backgroundColor: '#00bfa6',
                                color: 'black',
                                border: 'none',
                                borderRadius: 10,
                                width: '100%',
                                fontWeight: 'bold',
                                fontSize: 16,
                                cursor: 'pointer'
                            }} 
                            onClick={handleAddTrip}
                        >
                            Добавить поездку
                        </button>
                    </div>
                </>
            )}

            <CourierModal
                selectedCourier={selectedCourier}
                showModal={showModal}
                setShowModal={setShowModal}
                getRequestStatus={getRequestStatus}
                getStatusStyle={getStatusStyle}
                getStatusText={getStatusText}
                sentRequests={sentRequests}
                isRequestSent={isRequestSent}
                setShowRequestForm={setShowRequestForm}
            />

            <RequestForm
                selectedCourier={selectedCourier}
                showRequestForm={showRequestForm}
                setShowRequestForm={setShowRequestForm}
                requestForm={requestForm}
                setRequestForm={setRequestForm}
                handleSendRequest={handleSendRequest}
            />

            {showBackToTop && (
                <button
                    style={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        background: '#00bfa6',
                        color: 'black',
                        border: 'none',
                        borderRadius: '50%',
                        width: 50,
                        height: 50,
                        fontSize: 20,
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0,191,166,0.3)',
                        zIndex: 1000
                    }}
                    className="back-to-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    ↑
                </button>
            )}
        </div>
    );
};

export default SearchCouriers;