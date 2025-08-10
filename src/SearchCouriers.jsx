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
import ProfilePage from './components/ProfilePage';
import PackageDetails from './components/PackageDetails';

const SearchCouriers = () => {
    const [from, setFrom] = useState('Москва');
    const [to, setTo] = useState('Санкт-Петербург');
    const [results, setResults] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [sortBy, setSortBy] = useState('time');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [searchCollapsed, setSearchCollapsed] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showAboutPage, setShowAboutPage] = useState(false);
    const [showProfilePage, setShowProfilePage] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [userTrips, setUserTrips] = useState([
        {
            name: 'Никита',
            from: 'Москва',
            to: 'Казань',
            date: '2025-08-12',
            time: '14:30 → 16:45',
            airport: 'Шереметьево → Казань',
            avatar: 'https://i.pravatar.cc/100?img=50',
            tripsCount: 1,
            rating: 5.0,
            reviewsCount: 0,
            price: 700,
            tripComment: 'Лечу к родственникам, могу взять небольшие посылки',
            pastTrips: [],
            reviews: [],
            isUserTrip: true
        },
        {
            name: 'Никита',
            from: 'Санкт-Петербург',
            to: 'Екатеринбург',
            date: '2025-08-20',
            time: '10:15 → 14:30',
            airport: 'Пулково → Кольцово',
            avatar: 'https://i.pravatar.cc/100?img=50',
            tripsCount: 2,
            rating: 5.0,
            reviewsCount: 1,
            price: 900,
            tripComment: 'Командировка, есть место для документов и небольших посылок',
            pastTrips: [],
            reviews: [
                { rating: 5, text: 'Отличный курьер! Очень ответственный.', date: '2025-08-13' }
            ],
            isUserTrip: true
        }
    ]);
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
    const [myPackages, setMyPackages] = useState([
        {
            id: 1,
            from: 'Москва',
            to: 'Санкт-Петербург',
            description: 'Документы в папке',
            message: 'Нужно доставить документы для офиса',
            reward: 800,
            status: 'active',
            createdAt: Date.now() - 172800000,
            responses: [
                {
                    courierId: 'Иван2025-08-11',
                    courierName: 'Иван',
                    courierAvatar: 'https://i.pravatar.cc/100?img=12',
                    courierRating: 4.9,
                    date: '2025-08-11',
                    time: '15:00 → 17:30',
                    airport: 'Шереметьево → Пулково',
                    price: 800,
                    status: 'accepted',
                    comment: 'Принимаю! Доставлю аккуратно, буду на связи.',
                    timestamp: Date.now() - 86400000,
                    isNew: false
                },
                {
                    courierId: 'Елена2025-08-11',
                    courierName: 'Елена',
                    courierAvatar: 'https://i.pravatar.cc/100?img=44',
                    courierRating: 4.8,
                    date: '2025-08-11',
                    time: '09:30 → 11:45',
                    airport: 'Внуково → Пулково',
                    price: 750,
                    status: 'accepted',
                    comment: 'Могу взять документы, утренний рейс очень удобный.',
                    timestamp: Date.now() - 3600000,
                    isNew: true
                }
            ]
        },
        {
            id: 2,
            from: 'Москва',
            to: 'Санкт-Петербург',
            description: 'Небольшая коробка с подарком',
            message: 'Подарок для мамы, очень важно!',
            reward: 1200,
            status: 'waiting',
            createdAt: Date.now() - 43200000,
            responses: []
        },
        {
            id: 3,
            from: 'Москва',
            to: 'Санкт-Петербург',
            description: 'Медикаменты',
            message: 'Срочные лекарства',
            reward: 600,
            status: 'completed',
            createdAt: Date.now() - 259200000,
            selectedCourier: 'Анастасия',
            responses: [
                {
                    courierId: 'Максим2025-08-16',
                    courierName: 'Максим',
                    courierAvatar: 'https://i.pravatar.cc/100?img=68',
                    courierRating: 4.6,
                    date: '2025-08-16',
                    time: '12:00 → 14:30',
                    airport: 'Домодедово → Пулково',
                    price: 600,
                    status: 'declined',
                    comment: 'Извините, не смогу взять медикаменты - нет специальных условий хранения.',
                    timestamp: Date.now() - 172800000,
                    isNew: false
                }
            ]
        }
    ]);
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

        // Скрываем вылетевших курьеров
        const now = new Date();
        filtered = filtered.filter(c => {
            const [time] = c.time.split(' → ');
            const departureDateTime = new Date(`${c.date}T${time}:00`);
            return departureDateTime > now;
        });

        // Фильтрация по диапазону дат
        if (dateFrom) {
            filtered = filtered.filter(c => c.date >= dateFrom);
        }
        if (dateTo) {
            filtered = filtered.filter(c => c.date <= dateTo);
        }

        // Разделяем курьеров со статусом pending и остальных
        const pendingRequests = filtered.filter(c => getRequestStatus(c) === 'pending');
        const otherCouriers = filtered.filter(c => getRequestStatus(c) !== 'pending');

        // Сортируем каждую группу
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

        // Объединяем: сначала обычные курьеры, потом с pending статусом
        const sorted = [...sortGroup(otherCouriers), ...sortGroup(pendingRequests)];

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
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        backgroundColor: status === 'accepted' ? '#4BB34B' : 
                        status === 'declined' ? '#FF3333' : 
                        '#FFD700',
        color: status === 'pending' ? '#1a1a1a' : 'white'
    });

    // Utility functions
    const clearFromCity = () => {
        setFrom('');
        setResults([]);
        setSearchCollapsed(false);
    };
    const clearToCity = () => {
        setTo('');
        setResults([]);
        setSearchCollapsed(false);
    };

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
        const week = new Date(today);
        week.setDate(today.getDate() + 7);

        return [
            { 
                label: 'Сегодня-завтра', 
                action: () => {
                    setDateFrom(today.toISOString().split('T')[0]);
                    setDateTo(tomorrow.toISOString().split('T')[0]);
                }
            },
            { 
                label: 'Эта неделя', 
                action: () => {
                    setDateFrom(today.toISOString().split('T')[0]);
                    setDateTo(week.toISOString().split('T')[0]);
                }
            },
            { 
                label: 'Очистить', 
                action: () => {
                    setDateFrom('');
                    setDateTo('');
                }
            }
        ];
    };

    const getDateRangeLabel = () => {
        if (!dateFrom && !dateTo) return 'Любые даты';
        if (dateFrom && dateTo) {
            const fromDate = new Date(dateFrom);
            const toDate = new Date(dateTo);
            return `${fromDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${toDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
        }
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            return `c ${fromDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
        }
        if (dateTo) {
            const toDate = new Date(dateTo);
            return `до ${toDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
        }
        return 'Любые даты';
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
                reviews: [],
                isUserTrip: true
            };
            couriers.push(tripToAdd);
            setUserTrips([...userTrips, tripToAdd]);
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

        const handleSwitchToAddTrip = () => {
            setMode('add');
        };

        window.addEventListener('switchToAddTrip', handleSwitchToAddTrip);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('switchToAddTrip', handleSwitchToAddTrip);
        };
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

    // Telegram-native styles
    const styles = {
        page: {
            minHeight: '100vh',
            background: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-text-color, #ffffff)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'padding-top 0.3s ease',
            position: 'relative',
            padding: '0 16px'
        },
        compactHeader: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            backdropFilter: 'blur(20px)',
            borderBottom: '0.5px solid var(--tg-theme-hint-color, #708499)',
            padding: '12px 16px',
            zIndex: 100,
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
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--tg-theme-accent-text-color, #64b5ef)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
        },
        routeDisplay: {
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--tg-theme-text-color, #ffffff)',
            textAlign: 'center',
            flex: 1,
            margin: '0 16px'
        },
        editSearchButton: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: 'none',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
        },
        logoContainer: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 16px 16px',
            marginBottom: 8
        },
        logoSection: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            justifyContent: 'center'
        },
        logoButton: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
            padding: '8px 16px',
            borderRadius: 12
        },
        logoIcon: {
            width: 28,
            height: 28,
            background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 600
        },
        logoText: {
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--tg-theme-text-color, #ffffff)',
            letterSpacing: '-0.02em'
        }
    };

    return (
        <div style={styles.page}>
            {/* Compact header for results */}
            {searchCollapsed && (
                <div style={styles.compactHeader}>
                    <div style={styles.compactHeaderContent}>
                        <div style={styles.compactLogo}>
                            <div style={{...styles.logoIcon, width: 20, height: 20, fontSize: 12}}>📦</div>
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
            
            {/* Logo and Profile */}
            {!searchCollapsed && !showAboutPage && !showProfilePage && (
                <div style={styles.logoContainer}>
                    <div style={{ width: 32 }}></div>
                    <div style={styles.logoSection}>
                        <button 
                            style={styles.logoButton}
                            onClick={() => setShowAboutPage(true)}
                        >
                            <div style={styles.logoIcon}>📦</div>
                            <span style={styles.logoText}>PeerPack</span>
                        </button>
                    </div>
                    <button 
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 8,
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: 18,
                            transition: 'all 0.2s ease',
                            color: 'var(--tg-theme-hint-color, #708499)',
                            width: 32,
                            height: 32
                        }}
                        onClick={() => setShowProfilePage(true)}
                    >
                        👤
                    </button>
                </div>
            )}

            {showAboutPage ? (
                <AboutPage 
                    setShowAboutPage={setShowAboutPage}
                    animatedStats={animatedStats}
                />
            ) : showProfilePage ? (
                selectedPackage ? (
                    <PackageDetails 
                        packageData={selectedPackage}
                        setSelectedPackage={setSelectedPackage}
                        onSelectCourier={(packageId, courier) => {
                            console.log('Выбран курьер:', courier.courierName, 'для посылки:', packageId);
                            setSelectedPackage(null);
                            setShowProfilePage(false);
                        }}
                    />
                ) : (
                    <ProfilePage 
                        setShowProfilePage={setShowProfilePage}
                        myPackages={myPackages}
                        userTrips={userTrips}
                        setSelectedPackage={setSelectedPackage}
                    />
                )
            ) : mode === 'search' ? (
                <>
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
                        marginTop: results.length > 0 ? (searchCollapsed ? 8 : 0) : 30,
                        paddingTop: 0
                    }}>
                        {results.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center',
                                color: 'var(--tg-theme-hint-color, #708499)',
                                fontSize: 15,
                                padding: '40px 20px'
                            }}>
                                Курьеры не найдены
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
                        marginTop: 32, 
                        marginBottom: 32,
                        textAlign: 'center' 
                    }}>
                        <button 
                            style={{
                                background: 'transparent',
                                color: 'var(--tg-theme-link-color, #64b5ef)',
                                border: 'none',
                                fontSize: 15,
                                cursor: 'pointer',
                                textDecoration: 'none',
                                fontWeight: 500
                            }}
                            onClick={() => setMode('add')}
                        >
                            Вы курьер? Добавить поездку
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div style={{ width: '100%', maxWidth: 400, marginBottom: 20, paddingTop: 20 }}>
                        <button 
                            style={{
                                background: 'transparent',
                                color: 'var(--tg-theme-link-color, #64b5ef)',
                                border: 'none',
                                fontSize: 15,
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                            onClick={() => setMode('search')}
                        >
                            ← Назад к поиску курьеров
                        </button>
                    </div>
                    
                    <div style={{
                        background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                        padding: 20,
                        borderRadius: 12,
                        maxWidth: 400,
                        width: '100%',
                        border: '0.5px solid var(--tg-theme-hint-color, #708499)'
                    }}>
                        <h3 style={{
                            color: 'var(--tg-theme-text-color, #ffffff)',
                            fontSize: 18,
                            fontWeight: 600,
                            margin: '0 0 20px 0',
                            textAlign: 'center'
                        }}>Добавить поездку</h3>
                        
                        {Object.keys(newTrip).map((field) => (
                            <div key={field} style={{ marginBottom: 16 }}>
                                <label style={{
                                    color: 'var(--tg-theme-hint-color, #708499)',
                                    marginBottom: 6,
                                    display: 'block',
                                    fontSize: 14,
                                    fontWeight: 500
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
                                        padding: '12px 16px',
                                        width: '100%',
                                        background: 'var(--tg-theme-bg-color, #17212b)',
                                        border: '0.5px solid var(--tg-theme-hint-color, #708499)',
                                        borderRadius: 8,
                                        color: 'var(--tg-theme-text-color, #ffffff)',
                                        fontSize: 16,
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        ))}
                        
                        <button 
                            style={{
                                marginTop: 24,
                                padding: '12px 16px',
                                backgroundColor: 'var(--tg-theme-button-color, #5288c1)',
                                color: 'var(--tg-theme-button-text-color, #ffffff)',
                                border: 'none',
                                borderRadius: 8,
                                width: '100%',
                                fontWeight: 600,
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
                        background: 'var(--tg-theme-button-color, #5288c1)',
                        color: 'var(--tg-theme-button-text-color, #ffffff)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 44,
                        height: 44,
                        fontSize: 18,
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    ↑
                </button>
            )}
        </div>
    );
};

export default SearchCouriers;