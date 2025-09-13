import React, { useState, useEffect } from 'react';
import { injectCSS } from './styles/CourierAnimations';
import { couriers } from './data/mockData';
import { sortCouriers, getAvailableCities } from './utils/courierUtils';
import { useUserData, usePackageActions, useTripRequests, useCourierSearch } from './hooks/useApi';
import SearchForm from './components/SearchForm';
import CourierCard from './components/CourierCard';
import SortMenu from './components/SortMenu';
import CourierModal from './components/CourierModal';
import RequestForm from './components/RequestForm';
import AboutPage from './components/AboutPage';
import ProfilePage from './components/ProfilePage';
import PackageDetails from './components/PackageDetails';
import TripPackagesScreen from './components/TripPackagesScreen';
import CourierContactScreen from './components/CourierContactScreen';
import AddTripForm from './components/AddTripForm';

const SearchCouriers = () => {
    // API хуки
    const { 
        packages: myPackages, 
        setPackages: setMyPackages,
        trips: userTrips, 
        setTrips: setUserTrips,
        loading: userDataLoading,
        refreshUserData 
    } = useUserData();
    
    const { createPackage, createTrip, sendPackageToCourier } = usePackageActions();
    const { couriers, searchCouriers, loading: couriersLoading } = useCourierSearch();

    // UI состояния
    const [from, setFrom] = useState('Москва');
    const [to, setTo] = useState('Санкт-Петербург');
    const [results, setResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
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
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedCourierForContact, setSelectedCourierForContact] = useState(null);
    // packageRequests загружаются через useTripRequests hook для конкретных поездок
    // userTrips загружаются через useUserData hook
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
    // myPackages загружаются через useUserData hook
    const [sentRequests, setSentRequests] = useState([]);
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
    const [showAddTripForm, setShowAddTripForm] = useState(false);

    const availableCities = getAvailableCities(couriers);

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
            setSearchPerformed(true);
            if (sorted.length > 0) {
                setSearchCollapsed(true);
            }
        } catch (error) {
            console.error('Ошибка поиска:', error);
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

    const handleSendRequest = async () => {
        if (selectedCourier) {
            try {
                // Создаем посылку через API если это новая посылка
                if (!useExistingPackage && requestForm.packageDescription) {
                    const packageData = {
                        from: selectedCourier.from,
                        to: selectedCourier.to,
                        description: requestForm.packageDescription,
                        reward: requestForm.reward,
                        size: requestForm.size,
                        weight: requestForm.weight,
                        tags: requestForm.tags || [],
                        pickupAddress: requestForm.pickupAddress,
                        deliveryAddress: requestForm.deliveryAddress
                    };
                    await createPackage(packageData);
                }
                
                // Отправляем посылку курьеру
                const courierRequestData = {
                    message: requestForm.message,
                    reward: requestForm.reward,
                    packageDescription: requestForm.packageDescription
                };
                
                await sendPackageToCourier(selectedCourier.id, courierRequestData);
                
                // Обновляем данные
                refreshUserData();
                
                // Очищаем форму
                setRequestForm({ 
                    message: '', 
                    reward: 800, 
                    packageDescription: '',
                    size: '',
                    weight: '',
                    tags: [],
                    pickupAddress: '',
                    deliveryAddress: ''
                });
                
                setShowRequestForm(false);
                setShowModal(false);
            } catch (error) {
                console.error('Ошибка отправки заявки:', error);
                alert('Ошибка отправки заявки. Попробуйте ещё раз.');
            }
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
        setSearchPerformed(false);
        setSearchCollapsed(false);
    };
    const clearToCity = () => {
        setTo('');
        setResults([]);
        setSearchPerformed(false);
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

    const handleNotifyWhenAvailable = () => {
        // Создаем салют
        const createConfetti = () => {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'];
            const confettiCount = 50;
            
            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    border-radius: 50%;
                    animation: confetti-fall 3s linear forwards;
                    z-index: 10000;
                `;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }
        };
        
        // Добавляем CSS анимацию если её нет
        if (!document.querySelector('#confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confetti-fall {
                    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        createConfetti();
        
        // Показываем алерт
        setTimeout(() => {
            alert('🎉 Отлично! Мы уведомим вас, как только кто-то создаст подходящий маршрут в ближайший месяц!');
        }, 500);
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

    // Удалено: старая реализация handleAddTrip

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
            refreshUserData(); // Обновляем данные пользователя
            setShowAddTripForm(false);
        } catch (error) {
            console.error('Ошибка создания поездки:', error);
        }
    };

    // Effects
    useEffect(() => {
        injectCSS();
        
        // packageRequests теперь загружаются через API hooks
        
        // Обработчик события добавления поездки
        const handleSwitchToAddTrip = () => setShowAddTripForm(true);
        window.addEventListener('switchToAddTrip', handleSwitchToAddTrip);
        
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        
        return () => {
            window.removeEventListener('switchToAddTrip', handleSwitchToAddTrip);
            clearInterval(interval);
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

    // Показываем loading пока загружаются данные пользователя
    if (userDataLoading) {
        return (
            <div style={{
                ...styles.page,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: 'var(--tg-theme-hint-color, #708499)',
                    fontSize: 16
                }}>
                    Загрузка...
                </div>
            </div>
        );
    }

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
                selectedCourierForContact ? (
                    <CourierContactScreen 
                        courier={selectedCourierForContact.courier}
                        packageData={selectedCourierForContact.package}
                        onBack={() => setSelectedCourierForContact(null)}
                        onPaymentConfirm={() => {
                            setSelectedCourierForContact(null);
                            setSelectedPackage(null);
                            setShowProfilePage(false);
                        }}
                    />
                ) : selectedTrip ? (
                    <TripPackagesScreen 
                        trip={selectedTrip}
                        onBack={() => setSelectedTrip(null)}
                    />
                ) : selectedPackage ? (
                    <PackageDetails 
                        packageData={selectedPackage}
                        setSelectedPackage={setSelectedPackage}
                        onSelectCourier={(packageId, courier) => {
                            setSelectedCourierForContact({ 
                                courier, 
                                package: selectedPackage 
                            });
                        }}
                    />
                ) : (
                    <ProfilePage 
                        setShowProfilePage={setShowProfilePage}
                        myPackages={myPackages}
                        userTrips={userTrips}
                        setSelectedPackage={setSelectedPackage}
                        setSelectedTrip={setSelectedTrip}
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
                        marginTop: results.length > 0 ? (searchCollapsed ? 0 : 24) : 30,
                        paddingTop: searchCollapsed ? 60 : 0
                    }}>
                        {couriersLoading ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '60px 20px',
                                gap: 16
                            }}>
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    border: '3px solid var(--tg-theme-hint-color, #708499)',
                                    borderTop: '3px solid var(--tg-theme-button-color, #5288c1)',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <div style={{
                                    color: 'var(--tg-theme-hint-color, #708499)',
                                    fontSize: 15,
                                    fontWeight: 500
                                }}>
                                    Поиск курьеров...
                                </div>
                            </div>
                        ) : results.length === 0 && searchPerformed ? (
                            <div style={{ 
                                textAlign: 'center',
                                color: 'var(--tg-theme-hint-color, #708499)',
                                fontSize: 15,
                                padding: '40px 20px'
                            }}>
                                <div style={{ marginBottom: '20px' }}>
                                    Курьеры не найдены
                                </div>
                                <button 
                                    onClick={handleNotifyWhenAvailable}
                                    style={{
                                        backgroundColor: 'var(--tg-theme-button-color, #5288c1)',
                                        color: 'var(--tg-theme-button-text-color, #ffffff)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 16px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                                    onMouseLeave={(e) => e.target.style.opacity = '1'}
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
                            onClick={() => setShowAddTripForm(true)}
                        >
                            Близится поездка? Заработайте на ней!
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
                myPackages={myPackages}
                useExistingPackage={useExistingPackage}
                setUseExistingPackage={setUseExistingPackage}
            />

            <AddTripForm
                showAddTripForm={showAddTripForm}
                setShowAddTripForm={setShowAddTripForm}
                onAddTrip={handleAddTrip}
                availableCities={availableCities}
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