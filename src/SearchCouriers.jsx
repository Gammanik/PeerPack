import React, { useState, useEffect } from 'react';

// Добавляем CSS анимации
const injectCSS = () => {
    if (document.getElementById('courier-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'courier-animations';
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .card-hover:hover {
            transform: scale(1.02) !important;
            box-shadow: 0 8px 25px rgba(0,191,166,0.15) !important;
        }
        
        .button-hover:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 5px 15px rgba(0,191,166,0.3) !important;
        }
        
        .modal-enter {
            animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
            from { opacity: 0; transform: scale(0.9) translateY(-20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .status-update {
            animation: statusChange 0.6s ease-out;
        }
        
        @keyframes statusChange {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .card-hover:hover {
            transform: scale(1.02) translateY(-4px) !important;
            box-shadow: 0 12px 35px rgba(0,191,166,0.2) !important;
        }
        
        .sort-toggle:hover {
            color: #aaa !important;
        }
        
        .compact-sort-button:hover {
            background: rgba(0,191,166,0.05) !important;
            color: #ddd !important;
        }
        
        @keyframes logoGlow {
            0% { filter: drop-shadow(0 0 15px rgba(255,215,0,0.6)); }
            100% { filter: drop-shadow(0 0 25px rgba(255,215,0,1)) drop-shadow(0 0 35px rgba(0,191,166,0.4)); }
        }
        
        @keyframes shimmerText {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .back-to-top:hover {
            transform: scale(1.1) translateY(-2px) !important;
            box-shadow: 0 12px 30px rgba(0,191,166,0.5) !important;
        }
        
        .edit-search-button:hover {
            background: rgba(0,191,166,0.3) !important;
            transform: scale(1.05) !important;
        }
        
        .compact-logo-btn:hover {
            background: rgba(255,215,0,0.1) !important;
            transform: scale(1.05) !important;
        }
        
        .back-from-about:hover {
            background: rgba(255,255,255,0.2) !important;
            color: white !important;
        }
        
        .stat-card:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(0,191,166,0.2) !important;
        }
        
        .vision-card:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(255,215,0,0.2) !important;
        }
        
        .search-input:focus {
            border-color: #00bfa6 !important;
            box-shadow: 0 0 0 3px rgba(0,191,166,0.1) !important;
        }
        
        .search-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00bfa6, transparent);
            opacity: 0.6;
        }
    `;
    document.head.appendChild(style);
};

const cities = [
    "Москва", "Санкт-Петербург", "Казань", "Екатеринбург",
    "Новосибирск", "Сочи", "Самара", "Краснодар"
];

const couriers = [
    {
        name: 'Иван',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: '2025-07-15',
        time: '12:00 → 14:00',
        airport: 'Шереметьево → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=12',
        tripsCount: 47,
        rating: 4.9,
        reviewsCount: 32,
        price: 800,
        tripComment: 'Лечу по работе, могу взять документы или небольшие посылки',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-15', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-06-10', success: true },
            { from: 'Москва', to: 'Екатеринбург', date: '2025-05-20', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Отличный курьер! Быстро и аккуратно доставил документы.', date: '2025-06-16' },
            { rating: 5, text: 'Все супер, рекомендую!', date: '2025-06-11' },
            { rating: 4, text: 'Хорошо, но немного задержался с уведомлением о получении.', date: '2025-05-22' }
        ]
    },
    {
        name: 'Елена',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: '2025-07-15',
        time: '08:30 → 10:20',
        airport: 'Внуково → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=44',
        tripsCount: 28,
        rating: 4.8,
        reviewsCount: 21,
        price: 1200,
        tripComment: 'Утренний рейс, удобно для срочных доставок. Место только для документов',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-08', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-05-28', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Очень пунктуальная! Доставила точно в срок.', date: '2025-06-09' },
            { rating: 5, text: 'Профессиональный подход, рекомендую.', date: '2025-05-29' }
        ]
    },
    {
        name: 'Максим',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: '2025-07-15',
        time: '18:45 → 20:30',
        airport: 'Домодедово → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=68',
        tripsCount: 15,
        rating: 4.6,
        reviewsCount: 12,
        price: 600,
        tripComment: 'Студент, летаю часто к родителям. Недорого, но надежно!',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-01', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-05-15', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Отличный парень! Доставил быстро и недорого.', date: '2025-06-02' },
            { rating: 4, text: 'Все хорошо, молодец!', date: '2025-05-16' }
        ]
    },
    {
        name: 'Анастасия',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: '2025-07-16',
        time: '14:20 → 16:10',
        airport: 'Шереметьево → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=31',
        tripsCount: 52,
        rating: 5.0,
        reviewsCount: 45,
        price: 1500,
        tripComment: 'Премиум доставка. Фото отчеты, трекинг, страховка включена',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-12', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-06-05', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Лучший курьер! Идеальный сервис, всегда на связи.', date: '2025-06-13' },
            { rating: 5, text: 'Профессионал высшего класса. Стоит своих денег.', date: '2025-06-06' }
        ]
    },
    {
        name: 'Дмитрий',
        from: 'Москва',
        to: 'Санкт-Петербург',
        date: '2025-07-16',
        time: '06:50 → 08:40',
        airport: 'Внуково → Пулково',
        avatar: 'https://i.pravatar.cc/100?img=17',
        tripsCount: 34,
        rating: 4.7,
        reviewsCount: 28,
        price: 900,
        tripComment: 'Самый ранний рейс. Беру только легкие посылки до 2кг',
        pastTrips: [
            { from: 'Москва', to: 'Санкт-Петербург', date: '2025-06-03', success: true },
            { from: 'Санкт-Петербург', to: 'Москва', date: '2025-05-20', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Ранняя доставка - то что нужно! Спасибо!', date: '2025-06-04' },
            { rating: 4, text: 'Хороший курьер, но строго по весу.', date: '2025-05-21' }
        ]
    },
    {
        name: 'Анна',
        from: 'Казань',
        to: 'Екатеринбург',
        date: '2025-07-18',
        time: '09:30 → 12:10',
        airport: 'Казань → Кольцово',
        avatar: 'https://i.pravatar.cc/100?img=25',
        tripsCount: 23,
        rating: 4.7,
        reviewsCount: 18,
        price: 700,
        tripComment: 'Регулярные рейсы, доставляю аккуратно',
        pastTrips: [
            { from: 'Казань', to: 'Екатеринбург', date: '2025-06-20', success: true },
            { from: 'Екатеринбург', to: 'Москва', date: '2025-06-05', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Очень ответственная! Постоянно держала в курсе.', date: '2025-06-21' },
            { rating: 4, text: 'Все хорошо, спасибо!', date: '2025-06-06' }
        ]
    },
    {
        name: 'Олег',
        from: 'Москва',
        to: 'Сочи',
        date: '2025-07-20',
        time: '15:00 → 17:30',
        airport: 'Внуково → Адлер',
        avatar: 'https://i.pravatar.cc/100?img=33',
        tripsCount: 89,
        rating: 5.0,
        reviewsCount: 67,
        price: 1800,
        tripComment: 'Опытный курьер, беру любые посылки. Гарантия доставки',
        pastTrips: [
            { from: 'Москва', to: 'Сочи', date: '2025-06-25', success: true },
            { from: 'Сочи', to: 'Москва', date: '2025-06-15', success: true },
            { from: 'Москва', to: 'Краснодар', date: '2025-06-01', success: true }
        ],
        reviews: [
            { rating: 5, text: 'Профессионал высшего класса! Уже не первый раз пользуюсь услугами.', date: '2025-06-26' },
            { rating: 5, text: 'Идеально! Быстро, надежно, безопасно.', date: '2025-06-16' },
            { rating: 5, text: 'Рекомендую всем! Очень надежный курьер.', date: '2025-06-02' }
        ]
    }
];

const SearchCouriers = () => {
    const [from, setFrom] = useState('Москва');
    const [to, setTo] = useState('Санкт-Петербург');
    const [results, setResults] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [sortBy, setSortBy] = useState('time'); // time, price, rating
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
    const [mode, setMode] = useState('search'); // 'search' or 'add'
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

    // Получаем уникальные города из доступных маршрутов курьеров
    const getAvailableCities = () => {
        const uniqueCities = new Set();
        couriers.forEach(courier => {
            uniqueCities.add(courier.from);
            uniqueCities.add(courier.to);
        });
        return Array.from(uniqueCities).sort();
    };

    const availableCities = getAvailableCities();

    // Функция для отображения рейтинга звездочками
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push('★');
        }
        if (hasHalfStar) {
            stars.push('☆');
        }
        while (stars.length < 5) {
            stars.push('☆');
        }
        
        return stars.join('');
    };

    // Функция сортировки курьеров
    const sortCouriers = (couriersList, sortType) => {
        const sorted = [...couriersList];
        switch (sortType) {
            case 'time':
                return sorted.sort((a, b) => {
                    const timeA = a.time.split(' → ')[0];
                    const timeB = b.time.split(' → ')[0];
                    return timeA.localeCompare(timeB);
                });
            case 'price':
                return sorted.sort((a, b) => a.price - b.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            default:
                return sorted;
        }
    };

    // todo: http get: /search?from=Moscow,to=Saint-Petersburg,date-from..,date-to,sorted_by=prise
    const handleSearch = () => {
        const lowerFrom = from.trim().toLowerCase();
        const lowerTo = to.trim().toLowerCase();
        const filtered = couriers.filter(c =>
            c.from.toLowerCase() === lowerFrom &&
            c.to.toLowerCase() === lowerTo
        );
        const sorted = sortCouriers(filtered, sortBy);
        setResults(sorted);
        
        // На мобильных - скрываем поиск и скроллим к результатам
        if (window.innerWidth <= 768 && filtered.length > 0) {
            setTimeout(() => {
                setSearchCollapsed(true);
                const resultsSection = document.querySelector('.results-section');
                if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

    const handleAddTrip = () => {
        if (newTrip.name && newTrip.from && newTrip.to && newTrip.date && newTrip.time && newTrip.airport) {
            const tripToAdd = {
                ...newTrip,
                avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`,
                tripsCount: 1,
                rating: 5.0,
                reviewsCount: 0,
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
            alert('Поездка успешно добавлена!');
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    };

    const handleCourierClick = (courier) => {
        setSelectedCourier(courier);
        setShowModal(true);
    };

    const handleSendRequest = () => {
        if (requestForm.message && requestForm.packageDescription) {
            const request = {
                id: Date.now(),
                courierId: selectedCourier.name + selectedCourier.date,
                courierName: selectedCourier.name,
                route: `${selectedCourier.from} → ${selectedCourier.to}`,
                date: selectedCourier.date,
                message: requestForm.message,
                reward: requestForm.reward,
                packageDescription: requestForm.packageDescription,
                status: 'pending', // pending, declined, accepted, delivered
                courierComment: '', // Комментарий от доставщика
                createdAt: new Date().toISOString()
            };
            setSentRequests(prev => [...prev, request]);
            setRequestForm({ message: '', reward: 5, packageDescription: '' });
            setShowRequestForm(false);
            setShowModal(false);
            alert('Заявка отправлена курьеру!');
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    };

    const getRequestStatus = (courier) => {
        const request = sentRequests.find(req => req.courierId === courier.name + courier.date);
        return request ? request.status : null;
    };

    const isRequestSent = (courier) => {
        return sentRequests.some(req => req.courierId === courier.name + courier.date);
    };

    // Функция для имитации изменения статуса заявки (в реальном приложении это будет через API)
    const simulateStatusChange = () => {
        setSentRequests(prev => prev.map(req => {
            if (req.status === 'pending' && Math.random() > 0.7) {
                const statuses = ['accepted', 'declined'];
                const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const comments = {
                    'accepted': [
                        'Отлично! С удовольствием доставлю вашу посылку.',
                        'Принимаю заявку. Свяжемся перед вылетом.',
                        'Согласен! Место в багаже есть.',
                        'Хорошо, буду рад помочь с доставкой.'
                    ],
                    'declined': [
                        'К сожалению, багаж уже забит.',
                        'Извините, не смогу взять хрупкие вещи.',
                        'К сожалению, не подходит по размеру.',
                        'Простите, планы изменились.'
                    ]
                };
                return { 
                    ...req, 
                    status: newStatus,
                    courierComment: comments[newStatus][Math.floor(Math.random() * comments[newStatus].length)]
                };
            }
            if (req.status === 'accepted' && Math.random() > 0.8) {
                return { 
                    ...req, 
                    status: 'delivered',
                    courierComment: req.courierComment + ' Посылка доставлена успешно!'
                };
            }
            return req;
        }));
    };

    // Имитация обновления статусов каждые 10 секунд
    useEffect(() => {
        const interval = setInterval(simulateStatusChange, 10000);
        return () => clearInterval(interval);
    }, []);

    // Функции для отображения статусов
    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Ожидание ответа';
            case 'accepted': return 'Принята';
            case 'declined': return 'Отказано';
            case 'delivered': return 'Доставлено';
            default: return '';
        }
    };

    const getStatusStyle = (status) => {
        const baseStyle = {
            fontSize: 11,
            padding: '2px 6px',
            borderRadius: 4,
            marginLeft: 8
        };
        
        switch (status) {
            case 'pending': return { ...baseStyle, color: '#ffa726', backgroundColor: 'rgba(255, 167, 38, 0.1)' };
            case 'accepted': return { ...baseStyle, color: '#66bb6a', backgroundColor: 'rgba(102, 187, 106, 0.1)' };
            case 'declined': return { ...baseStyle, color: '#ef5350', backgroundColor: 'rgba(239, 83, 80, 0.1)' };
            case 'delivered': return { ...baseStyle, color: '#00bfa6', backgroundColor: 'rgba(0, 191, 166, 0.1)' };
            default: return baseStyle;
        }
    };

    // Инициализация CSS и автоматический поиск при загрузке компонента
    useEffect(() => {
        injectCSS();
        handleSearch();
    }, []);
    
    // Пересортировка при изменении типа сортировки
    useEffect(() => {
        if (results.length > 0) {
            const sorted = sortCouriers(results, sortBy);
            setResults(sorted);
        }
    }, [sortBy]);
    
    // Закрытие меню сортировки при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSortMenu && !event.target.closest('.compact-sort-section')) {
                setShowSortMenu(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSortMenu]);
    
    // Отслеживание скролла для кнопки "Наверх"
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Плавный возврат к поиску
    const scrollToSearch = () => {
        setSearchCollapsed(false);
        setShowAboutPage(false);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };
    
    // Анимация счетчиков статистики
    const animateCounter = (start, end, duration, callback) => {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            callback(current);
            if (progress >= 1) clearInterval(timer);
        }, 16);
    };
    
    // Запуск анимации при открытии страницы About
    useEffect(() => {
        if (showAboutPage) {
            // Обнуляем счетчики
            setAnimatedStats({ trips: 0, rating: 0, couriers: 0, totalTrips: 0 });
            
            // Запускаем анимации с задержкой
            setTimeout(() => {
                animateCounter(0, 5200000, 2000, (val) => 
                    setAnimatedStats(prev => ({ ...prev, trips: val })));
            }, 300);
            
            setTimeout(() => {
                animateCounter(0, 48, 1500, (val) => 
                    setAnimatedStats(prev => ({ ...prev, rating: val / 10 })));
            }, 600);
            
            setTimeout(() => {
                animateCounter(0, 125000, 2500, (val) => 
                    setAnimatedStats(prev => ({ ...prev, couriers: val })));
            }, 900);
            
            setTimeout(() => {
                animateCounter(0, 8500000, 2800, (val) => 
                    setAnimatedStats(prev => ({ ...prev, totalTrips: val })));
            }, 1200);
        }
    }, [showAboutPage]);

    // Функции для работы с датами
    const getDatePresets = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        return [
            { label: 'Сегодня', value: today.toISOString().split('T')[0] },
            { label: 'Завтра', value: tomorrow.toISOString().split('T')[0] },
            { label: 'Через неделю', value: nextWeek.toISOString().split('T')[0] },
            { label: 'Любая дата', value: '' }
        ];
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Любая дата';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'short',
            weekday: 'short'
        });
    };

    return (
        <div style={{
            ...styles.page,
            paddingTop: searchCollapsed ? '80px' : '20px'
        }}>
            {/* Мобильная компактная шапка для результатов */}
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
            
            {/* Компактный логотип в поиске */}
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
                <div style={styles.aboutPage}>
                    <div style={styles.aboutHeader}>
                        <button 
                            style={styles.backFromAboutButton}
                            onClick={() => setShowAboutPage(false)}
                            className="back-from-about"
                        >
                            ← Назад
                        </button>
                        <div style={styles.aboutTitle}>
                            <div style={styles.aboutLogo}>⚡</div>
                            <h1 style={styles.aboutBrandTitle}>PeerPack</h1>
                        </div>
                    </div>
                    
                    <div style={styles.aboutContent}>
                        <div style={styles.missionSection}>
                            <h2 style={styles.sectionTitle}>О компании</h2>
                            <p style={styles.missionText}>
                                Мы соединяем людей через доверие и взаимопомощь. 
                                Каждая посылка — это возможность помочь и заработать. 
                                Просто, безопасно, надежно.
                            </p>
                        </div>
                        
                        <div style={styles.statsSection}>
                            <h2 style={styles.sectionTitle}>Наши достижения</h2>
                            <div style={styles.statsGrid}>
                                <div className="stat-card" style={styles.statCard}>
                                    <div style={styles.statIcon}>🚀</div>
                                    <div style={styles.statNumber}>
                                        {animatedStats.trips.toLocaleString()}
                                    </div>
                                    <div style={styles.statLabel}>успешных доставок</div>
                                </div>
                                
                                <div className="stat-card" style={styles.statCard}>
                                    <div style={styles.statIcon}>⭐</div>
                                    <div style={styles.statNumber}>
                                        {animatedStats.rating.toFixed(1)}
                                    </div>
                                    <div style={styles.statLabel}>средний рейтинг</div>
                                </div>
                                
                                <div className="stat-card" style={styles.statCard}>
                                    <div style={styles.statIcon}>🤝</div>
                                    <div style={styles.statNumber}>
                                        {animatedStats.couriers.toLocaleString()}
                                    </div>
                                    <div style={styles.statLabel}>доставщиков в сети</div>
                                </div>
                                
                                <div className="stat-card" style={styles.statCard}>
                                    <div style={styles.statIcon}>✈️</div>
                                    <div style={styles.statNumber}>
                                        {animatedStats.totalTrips.toLocaleString()}
                                    </div>
                                    <div style={styles.statLabel}>общее количество поездок</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style={styles.visionSection}>
                            <h2 style={styles.sectionTitle}>Наша миссия</h2>
                            <div style={styles.visionGrid}>
                                <div className="vision-card" style={styles.visionCard}>
                                    <div style={styles.visionIcon}>⚡</div>
                                    <div style={styles.visionTitle}>Удобство</div>
                                    <div style={styles.visionText}>Простое объявление и быстрый поиск доставщика</div>
                                </div>
                                <div className="vision-card" style={styles.visionCard}>
                                    <div style={styles.visionIcon}>🔒</div>
                                    <div style={styles.visionTitle}>Надежность</div>
                                    <div style={styles.visionText}>Проверенные доставщики с рейтингом и отзывами</div>
                                </div>
                                <div className="vision-card" style={styles.visionCard}>
                                    <div style={styles.visionIcon}>🌍</div>
                                    <div style={styles.visionTitle}>Экономия</div>
                                    <div style={styles.visionText}>Дешевле курьерских служб благодаря P2P модели</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : mode === 'search' ? (
                <>
                    {!searchCollapsed && (
                        <div className="search-container" style={styles.searchContainer}>
                        <label style={styles.label}>Откуда отправить</label>
                        <input
                            className="search-input"
                            list="available-cities"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder="Например, Москва"
                            style={styles.input}
                        />
                        <label style={styles.label}>Куда доставить</label>
                        <input
                            className="search-input"
                            list="available-cities"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="Например, Сочи"
                            style={styles.input}
                        />
                        <datalist id="available-cities">
                            {availableCities.map(city => (
                                <option key={city} value={city} />
                            ))}
                        </datalist>
                        
                        <label style={styles.label}>Дата отправления</label>
                        <div style={styles.datePickerContainer}>
                            <button
                                style={styles.dateButton}
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                {formatDate(selectedDate)} 📅
                            </button>
                            
                            {showDatePicker && (
                                <div style={styles.dateDropdown}>
                                    <div style={styles.datePresets}>
                                        {getDatePresets().map((preset, index) => (
                                            <button
                                                key={index}
                                                style={{
                                                    ...styles.datePreset,
                                                    ...(selectedDate === preset.value ? styles.datePresetActive : {})
                                                }}
                                                onClick={() => {
                                                    setSelectedDate(preset.value);
                                                    setShowDatePicker(false);
                                                }}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={styles.dateSeparator}>или выберите дату</div>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            setShowDatePicker(false);
                                        }}
                                        style={styles.dateInput}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            )}
                        </div>
                        
                        <button 
                            className="button-hover"
                            style={styles.searchButton} 
                            onClick={handleSearch}
                        >
                            <span style={styles.searchButtonIcon}>📦</span>
                            Передать посылку
                        </button>
                        </div>
                    )}

                    {/* Минимальная опциональная сортировка */}
                    {results.length > 1 && (
                        <div className="compact-sort-section" style={styles.compactSortSection}>
                            <button 
                                className="sort-toggle"
                                style={styles.sortToggle}
                                onClick={() => setShowSortMenu(!showSortMenu)}
                            >
                                сортировка ▼
                            </button>
                            {showSortMenu && (
                                <div style={styles.sortDropdown}>
                                    <button 
                                        className="compact-sort-button"
                                        style={{
                                            ...styles.compactSortButton,
                                            ...(sortBy === 'time' ? styles.compactSortButtonActive : {})
                                        }}
                                        onClick={() => {
                                            setSortBy('time');
                                            const sorted = sortCouriers(results, 'time');
                                            setResults(sorted);
                                            setShowSortMenu(false);
                                        }}
                                    >
                                        по времени
                                    </button>
                                    <button 
                                        className="compact-sort-button"
                                        style={{
                                            ...styles.compactSortButton,
                                            ...(sortBy === 'price' ? styles.compactSortButtonActive : {})
                                        }}
                                        onClick={() => {
                                            setSortBy('price');
                                            const sorted = sortCouriers(results, 'price');
                                            setResults(sorted);
                                            setShowSortMenu(false);
                                        }}
                                    >
                                        по цене
                                    </button>
                                    <button 
                                        className="compact-sort-button"
                                        style={{
                                            ...styles.compactSortButton,
                                            ...(sortBy === 'rating' ? styles.compactSortButtonActive : {})
                                        }}
                                        onClick={() => {
                                            setSortBy('rating');
                                            const sorted = sortCouriers(results, 'rating');
                                            setResults(sorted);
                                            setShowSortMenu(false);
                                        }}
                                    >
                                        по рейтингу
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="results-section" style={{ width: '100%', maxWidth: 400, marginTop: results.length > 0 ? 15 : 30 }}>
                        {results.length === 0 ? (
                            <p style={{ color: '#aaa' }}>Доставщики не найдены.</p>
                        ) : results.map((c, index) => (
                            <div 
                                key={c.name + c.date} 
                                className="card-hover"
                                style={{
                                    ...styles.newCard, 
                                    cursor: 'pointer',
                                    animationDelay: `${index * 0.1}s`
                                }}
                                onClick={() => handleCourierClick(c)}
                            >
                                <div style={styles.cardHeader}>
                                    <div style={styles.courierInfo1}>
                                        <img src={c.avatar} alt={c.name} style={styles.avatar} />
                                        <div style={styles.courierDetails}>
                                            <div style={styles.courierName}>{c.name}</div>
                                            <div style={styles.rating}>
                                                <span style={styles.stars}>{renderStars(c.rating)}</span>
                                                <span style={styles.ratingText}>{c.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.priceTag}>₽{c.price}</div>
                                </div>
                                
                                <div style={styles.routeSection}>
                                    <div style={styles.routeInfo}>
                                        <div style={styles.cities}>{c.from} → {c.to}</div>
                                        <div style={styles.timeInfo}>
                                            <span style={styles.timeHighlight}>🕐 {c.time}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={styles.commentSection}>
                                    <div style={styles.commentIcon}>💬</div>
                                    <div style={styles.commentText}>{c.tripComment}</div>
                                </div>
                                
                                <div style={styles.cardFooter}>
                                    <div style={styles.statsInfo}>
                                        <span style={styles.tripsCount}>{c.tripsCount} поездок</span>
                                        <span style={styles.reviewsCount}>• {c.reviewsCount} отзывов</span>
                                    </div>
                                    {getRequestStatus(c) && (
                                        <span style={getStatusStyle(getRequestStatus(c))}>
                                            {getStatusText(getRequestStatus(c))}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.courierLinkContainer}>
                        <button 
                            style={styles.courierLink}
                            onClick={() => setMode('add')}
                        >
                            Вы доставщик? Добавить поездку
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div style={styles.backLink}>
                        <button 
                            style={styles.backButton}
                            onClick={() => setMode('search')}
                        >
                            ← Назад к поиску курьеров
                        </button>
                    </div>
                    
                    <div style={styles.container}>
                        <h3 style={styles.addTripTitle}>Добавить поездку</h3>
                        
                        <label style={styles.label}>Ваше имя</label>
                        <input
                            value={newTrip.name}
                            onChange={(e) => setNewTrip({...newTrip, name: e.target.value})}
                            placeholder="Например, Анна"
                            style={styles.input}
                        />
                        
                        <label style={styles.label}>Откуда</label>
                        <input
                            list="all-cities"
                            value={newTrip.from}
                            onChange={(e) => setNewTrip({...newTrip, from: e.target.value})}
                            placeholder="Например, Москва"
                            style={styles.input}
                        />
                        
                        <label style={styles.label}>Куда</label>
                        <input
                            list="all-cities"
                            value={newTrip.to}
                            onChange={(e) => setNewTrip({...newTrip, to: e.target.value})}
                            placeholder="Например, Сочи"
                            style={styles.input}
                        />
                        
                        <label style={styles.label}>Дата</label>
                        <input
                            type="date"
                            value={newTrip.date}
                            onChange={(e) => setNewTrip({...newTrip, date: e.target.value})}
                            style={styles.input}
                        />
                        
                        <label style={styles.label}>Время вылета → прилета</label>
                        <input
                            value={newTrip.time}
                            onChange={(e) => setNewTrip({...newTrip, time: e.target.value})}
                            placeholder="Например, 15:00 → 17:30"
                            style={styles.input}
                        />
                        
                        <label style={styles.label}>Аэропорты</label>
                        <input
                            value={newTrip.airport}
                            onChange={(e) => setNewTrip({...newTrip, airport: e.target.value})}
                            placeholder="Например, Внуково → Адлер"
                            style={styles.input}
                        />
                        
                        <datalist id="all-cities">
                            {cities.map(city => (
                                <option key={city} value={city} />
                            ))}
                        </datalist>
                        
                        <button style={styles.button} onClick={handleAddTrip}>
                            Добавить поездку
                        </button>
                    </div>
                </>
            )}

            {/* Модальное окно с деталями курьера */}
            {showModal && selectedCourier && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className="modal-enter" style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3>{selectedCourier.name}</h3>
                            <button 
                                style={styles.closeButton}
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div style={styles.modalContent}>
                            <div style={styles.courierInfo}>
                                <img src={selectedCourier.avatar} alt={selectedCourier.name} style={styles.modalAvatar} />
                                <div>
                                    <div style={styles.rating}>
                                        <span style={styles.stars}>{renderStars(selectedCourier.rating)}</span>
                                        <span style={styles.ratingText}>{selectedCourier.rating} ({selectedCourier.reviewsCount} отзывов)</span>
                                    </div>
                                    <p style={styles.trips}>{selectedCourier.tripsCount} успешных поездок</p>
                                </div>
                            </div>

                            <div style={styles.tripInfo}>
                                <h4>Предстоящая поездка</h4>
                                <p><strong>{selectedCourier.from} → {selectedCourier.to}</strong></p>
                                <p>{selectedCourier.date}, {selectedCourier.time}</p>
                                <p>Аэропорт: {selectedCourier.airport}</p>
                            </div>

                            <div style={styles.pastTripsSection}>
                                <h4>Последние поездки</h4>
                                {selectedCourier.pastTrips.map((trip, index) => (
                                    <div key={index} style={styles.pastTrip}>
                                        <span>{trip.from} → {trip.to}</span>
                                        <span style={styles.tripDate}>{trip.date}</span>
                                        <span style={styles.tripStatus}>✓</span>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.reviewsSection}>
                                <h4>Отзывы</h4>
                                {selectedCourier.reviews.map((review, index) => (
                                    <div key={index} style={styles.review}>
                                        <div style={styles.reviewHeader}>
                                            <span style={styles.stars}>{renderStars(review.rating)}</span>
                                            <span style={styles.reviewDate}>{review.date}</span>
                                        </div>
                                        <p style={styles.reviewText}>{review.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Показать статус и комментарий заявки, если есть */}
                            {getRequestStatus(selectedCourier) && (
                                <div style={styles.requestStatusSection}>
                                    <h4>Статус вашей заявки</h4>
                                    <div style={{
                                        ...styles.requestStatus,
                                        ...getStatusStyle(getRequestStatus(selectedCourier))
                                    }}>
                                        {getStatusText(getRequestStatus(selectedCourier))}
                                    </div>
                                    {sentRequests.find(req => req.courierId === selectedCourier.name + selectedCourier.date)?.courierComment && (
                                        <div style={styles.courierCommentBox}>
                                            <strong>Комментарий от {selectedCourier.name}:</strong>
                                            <p style={styles.courierComment}>
                                                {sentRequests.find(req => req.courierId === selectedCourier.name + selectedCourier.date)?.courierComment}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isRequestSent(selectedCourier) && (
                                <button 
                                    className="button-hover"
                                    style={styles.requestButton}
                                    onClick={() => setShowRequestForm(true)}
                                >
                                    Отправить заявку на доставку
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно с формой заявки */}
            {showRequestForm && selectedCourier && (
                <div style={styles.modalOverlay} onClick={() => setShowRequestForm(false)}>
                    <div className="modal-enter" style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3>Заявка на доставку</h3>
                            <button 
                                style={styles.closeButton}
                                onClick={() => setShowRequestForm(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div style={styles.modalContent}>
                            <p><strong>Курьер:</strong> {selectedCourier.name}</p>
                            <p><strong>Маршрут:</strong> {selectedCourier.from} → {selectedCourier.to}</p>
                            <p><strong>Дата:</strong> {selectedCourier.date}</p>
                            
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Описание посылки</label>
                                <textarea
                                    value={requestForm.packageDescription}
                                    onChange={(e) => setRequestForm({...requestForm, packageDescription: e.target.value})}
                                    placeholder="Опишите что нужно доставить (размер, вес, хрупкость)"
                                    style={styles.textarea}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Сообщение курьеру</label>
                                <textarea
                                    value={requestForm.message}
                                    onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                                    placeholder="Дополнительная информация, особые пожелания"
                                    style={styles.textarea}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Вознаграждение (в звездах)</label>
                                <div style={styles.rewardSelector}>
                                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                        <button
                                            key={num}
                                            style={{
                                                ...styles.rewardButton,
                                                ...(requestForm.reward === num ? styles.rewardButtonActive : {})
                                            }}
                                            onClick={() => setRequestForm({...requestForm, reward: num})}
                                        >
                                            {num}★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={styles.modalButtons}>
                                <button 
                                    style={styles.cancelButton}
                                    onClick={() => setShowRequestForm(false)}
                                >
                                    Отмена
                                </button>
                                <button 
                                    className="button-hover"
                                    style={styles.sendButton}
                                    onClick={handleSendRequest}
                                >
                                    Отправить заявку
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Кнопка наверх */}
            {showBackToTop && (
                <button 
                    style={styles.backToTopButton}
                    onClick={scrollToSearch}
                    className="back-to-top"
                >
                    <span style={styles.backToTopIcon}>↑</span>
                    <span style={styles.backToTopText}>поиск</span>
                </button>
            )}
        </div>
    );
};

const styles = {
    page: {
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
        color: '#fff',
        minHeight: '100vh',
        padding: '20px 15px',
        paddingTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden'
    },
    modeToggle: {
        display: 'flex',
        gap: 10,
        marginBottom: 20,
        background: '#2b2b2b',
        padding: 4,
        borderRadius: 12,
        border: '1px solid #3a3a3a'
    },
    toggleButton: {
        padding: '8px 16px',
        background: 'transparent',
        color: '#aaa',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 14,
        transition: 'all 0.2s'
    },
    activeToggle: {
        background: '#00bfa6',
        color: 'black',
        fontWeight: 'bold'
    },
    // Основная шапка с фирменным стилем
    header: {
        width: '100%',
        maxWidth: 500,
        marginBottom: 30,
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%)',
        borderRadius: 24,
        padding: 30,
        border: '2px solid rgba(255,215,0,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden'
    },
    headerContent: {
        position: 'relative',
        zIndex: 2
    },
    brandSection: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24
    },
    mainLogo: {
        fontSize: 40,
        filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.8))',
        animation: 'logoGlow 3s ease-in-out infinite alternate'
    },
    brandInfo: {
        flex: 1
    },
    brandTitle: {
        fontSize: 28,
        fontWeight: 800,
        margin: 0,
        marginBottom: 6,
        background: 'linear-gradient(135deg, #FFD700, #00bfa6, #FFD700)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        backgroundSize: '200% 100%',
        animation: 'shimmerText 3s ease-in-out infinite'
    },
    brandTagline: {
        fontSize: 13,
        color: '#aaa',
        margin: 0,
        lineHeight: 1.4,
        fontWeight: 500
    },
    trustIndicators: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 8
    },
    trustBadge: {
        background: 'rgba(0,191,166,0.1)',
        border: '1px solid rgba(0,191,166,0.3)',
        borderRadius: 12,
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        flex: 1,
        minWidth: 0
    },
    trustIcon: {
        fontSize: 16
    },
    trustText: {
        fontSize: 10,
        color: '#00bfa6',
        fontWeight: 600,
        textAlign: 'center',
        lineHeight: 1.2
    },
    searchButton: {
        marginTop: 20,
        padding: '14px 20px',
        background: 'linear-gradient(135deg, #00bfa6, #00d4aa)',
        color: 'black',
        border: 'none',
        borderRadius: 14,
        width: '100%',
        fontWeight: 700,
        fontSize: 16,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        boxShadow: '0 6px 20px rgba(0,191,166,0.3)'
    },
    searchButtonIcon: {
        fontSize: 18
    },
    searchContainer: {
        background: 'linear-gradient(135deg, #2b2b2b 0%, #2a2a2a 100%)',
        padding: 24,
        borderRadius: 20,
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '1px solid #3a3a3a',
        position: 'relative',
        overflow: 'hidden'
    },
    courierLinkContainer: {
        marginTop: 40,
        textAlign: 'center'
    },
    courierLink: {
        background: 'transparent',
        color: '#00bfa6',
        border: 'none',
        fontSize: 14,
        cursor: 'pointer',
        textDecoration: 'underline'
    },
    backLink: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 20
    },
    backButton: {
        background: 'transparent',
        color: '#aaa',
        border: 'none',
        fontSize: 14,
        cursor: 'pointer'
    },
    addTripTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        margin: '0 0 20px 0',
        textAlign: 'center'
    },
    container: {
        background: '#2b2b2b',
        padding: 20,
        borderRadius: 16,
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 0 15px rgba(0,0,0,0.3)'
    },
    label: {
        color: '#aaa',
        marginTop: 15,
        marginBottom: 5,
        display: 'block',
        fontSize: 14
    },
    input: {
        padding: 14,
        width: '100%',
        background: '#1c1c1c',
        border: '1px solid #3a3a3a',
        borderRadius: 12,
        color: 'white',
        fontSize: 15,
        transition: 'all 0.3s ease',
        outline: 'none'
    },
    button: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#00bfa6',
        color: 'black',
        border: 'none',
        borderRadius: 10,
        width: '100%',
        fontWeight: 'bold',
        fontSize: 16,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'scale(1)'
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        background: '#2b2b2b',
        padding: 12,
        borderRadius: 14,
        border: '1px solid #3a3a3a',
        marginBottom: 15,
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        opacity: 1,
        animation: 'slideIn 0.5s ease-out'
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    cardContent: {
        flex: 1
    },
    cardRoute: {
        marginTop: 8,
        fontSize: 14
    },
    courierHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
    },
    courierStats: {
        fontSize: 12,
        color: '#aaa'
    },
    trips: {
        fontSize: 12,
        color: '#00bfa6'
    },
    rating: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6
    },
    stars: {
        color: '#ffd700',
        fontSize: 16
    },
    ratingText: {
        fontSize: 12,
        color: '#aaa'
    },
    requestSent: {
        fontSize: 11,
        color: '#00bfa6',
        backgroundColor: 'rgba(0, 191, 166, 0.1)',
        padding: '2px 6px',
        borderRadius: 4,
        marginLeft: 8
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
        backgroundColor: '#2b2b2b',
        borderRadius: 16,
        padding: 0,
        maxWidth: 500,
        width: '90%',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 20px 10px',
        borderBottom: '1px solid #3a3a3a'
    },
    closeButton: {
        background: 'transparent',
        border: 'none',
        color: '#aaa',
        fontSize: 20,
        cursor: 'pointer'
    },
    modalContent: {
        padding: 20,
        maxHeight: 'calc(80vh - 70px)',
        overflowY: 'auto'
    },
    courierInfo1: {
        display: 'flex',
        gap: 15,
        marginBottom: 20,
        alignItems: 'center'
    },
    modalAvatar: {
        width: 60,
        height: 60,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    tripInfo: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#1c1c1c',
        borderRadius: 8
    },
    pastTripsSection: {
        marginBottom: 20
    },
    pastTrip: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #3a3a3a'
    },
    tripDate: {
        fontSize: 12,
        color: '#aaa'
    },
    tripStatus: {
        color: '#00bfa6',
        fontSize: 14
    },
    reviewsSection: {
        marginBottom: 20
    },
    review: {
        padding: '10px 0',
        borderBottom: '1px solid #3a3a3a'
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    reviewDate: {
        fontSize: 11,
        color: '#aaa'
    },
    reviewText: {
        fontSize: 14,
        color: '#ddd',
        margin: 0
    },
    requestButton: {
        width: '100%',
        padding: 12,
        backgroundColor: '#00bfa6',
        color: 'black',
        border: 'none',
        borderRadius: 10,
        fontWeight: 'bold',
        fontSize: 16,
        cursor: 'pointer'
    },
    formGroup: {
        marginBottom: 15
    },
    textarea: {
        width: '100%',
        padding: 10,
        background: '#1c1c1c',
        border: '1px solid #3a3a3a',
        borderRadius: 8,
        color: 'white',
        fontSize: 14,
        minHeight: 80,
        resize: 'vertical'
    },
    rewardSelector: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
    },
    rewardButton: {
        padding: '8px 12px',
        background: '#1c1c1c',
        color: '#aaa',
        border: '1px solid #3a3a3a',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 14
    },
    rewardButtonActive: {
        background: '#00bfa6',
        color: 'black',
        border: '1px solid #00bfa6'
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
        color: '#aaa',
        border: '1px solid #3a3a3a',
        borderRadius: 10,
        cursor: 'pointer'
    },
    sendButton: {
        flex: 1,
        padding: 12,
        backgroundColor: '#00bfa6',
        color: 'black',
        border: 'none',
        borderRadius: 10,
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    // Стили для пикера дат
    datePickerContainer: {
        position: 'relative',
        marginBottom: 15
    },
    dateButton: {
        width: '100%',
        padding: 12,
        background: '#1c1c1c',
        color: 'white',
        border: '1px solid #3a3a3a',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 15,
        textAlign: 'left',
        transition: 'all 0.2s ease'
    },
    dateDropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: '#2b2b2b',
        border: '1px solid #3a3a3a',
        borderRadius: 8,
        padding: 15,
        zIndex: 100,
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        animation: 'slideIn 0.2s ease-out'
    },
    datePresets: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        marginBottom: 15
    },
    datePreset: {
        padding: '8px 12px',
        background: '#1c1c1c',
        color: '#aaa',
        border: '1px solid #3a3a3a',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 14,
        transition: 'all 0.2s ease'
    },
    datePresetActive: {
        background: '#00bfa6',
        color: 'black',
        border: '1px solid #00bfa6'
    },
    dateSeparator: {
        textAlign: 'center',
        color: '#aaa',
        fontSize: 12,
        marginBottom: 10,
        padding: '5px 0',
        borderTop: '1px solid #3a3a3a'
    },
    dateInput: {
        width: '100%',
        padding: 10,
        background: '#1c1c1c',
        border: '1px solid #3a3a3a',
        borderRadius: 6,
        color: 'white',
        fontSize: 14
    },
    // Стили для комментариев от курьеров
    requestStatusSection: {
        marginTop: 20,
        padding: 15,
        background: '#1c1c1c',
        borderRadius: 8,
        border: '1px solid #3a3a3a'
    },
    requestStatus: {
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10
    },
    courierCommentBox: {
        marginTop: 15,
        padding: 12,
        background: '#2b2b2b',
        borderRadius: 8,
        border: '1px solid #3a3a3a'
    },
    courierComment: {
        margin: '8px 0 0 0',
        color: '#ddd',
        fontSize: 14,
        lineHeight: 1.4,
        fontStyle: 'italic'
    },
    // Минимальная опциональная сортировка
    compactSortSection: {
        width: '100%',
        maxWidth: 400,
        marginTop: 10,
        marginBottom: 15,
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'relative'
    },
    sortToggle: {
        background: 'transparent',
        border: 'none',
        color: '#777',
        fontSize: 13,
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: 4,
        transition: 'color 0.2s ease'
    },
    sortDropdown: {
        position: 'absolute',
        top: '100%',
        right: 0,
        background: '#2b2b2b',
        border: '1px solid #3a3a3a',
        borderRadius: 8,
        padding: 6,
        marginTop: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 10,
        minWidth: 120
    },
    compactSortButton: {
        width: '100%',
        background: 'transparent',
        border: 'none',
        color: '#aaa',
        fontSize: 13,
        cursor: 'pointer',
        padding: '6px 10px',
        borderRadius: 4,
        textAlign: 'left',
        transition: 'all 0.2s ease'
    },
    compactSortButtonActive: {
        color: '#00bfa6',
        background: 'rgba(0,191,166,0.1)'
    },
    // Новые стили для карточек курьеров
    newCard: {
        background: 'linear-gradient(135deg, #2b2b2b 0%, #2a2a2a 100%)',
        border: '1px solid #3a3a3a',
        borderRadius: 16,
        padding: 0,
        marginBottom: 16,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
        opacity: 1,
        animation: 'slideIn 0.5s ease-out',
        overflow: 'hidden'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px 12px',
        borderBottom: '1px solid rgba(58, 58, 58, 0.5)'
    },
    courierInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
    },
    courierDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
    },
    courierName: {
        fontSize: 16,
        fontWeight: 600,
        color: 'white'
    },
    priceTag: {
        background: '#00bfa6',
        color: 'black',
        padding: '6px 12px',
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 700
    },
    routeSection: {
        padding: '12px 20px 8px'
    },
    routeInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cities: {
        fontSize: 16,
        fontWeight: 600,
        color: 'white'
    },
    timeInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
    },
    timeHighlight: {
        background: 'rgba(0, 191, 166, 0.1)',
        color: '#00bfa6',
        padding: '4px 8px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        border: '1px solid rgba(0, 191, 166, 0.3)'
    },
    commentSection: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '8px 20px 12px',
        background: 'rgba(28, 28, 28, 0.5)'
    },
    commentIcon: {
        fontSize: 14,
        marginTop: 2
    },
    commentText: {
        flex: 1,
        fontSize: 13,
        color: '#ddd',
        lineHeight: 1.4,
        fontStyle: 'italic'
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px 16px'
    },
    statsInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: '#aaa'
    },
    tripsCount: {
        color: '#00bfa6',
        fontWeight: 500
    },
    reviewsCount: {
        color: '#aaa'
    },
    
    // Компактная мобильная шапка
    compactHeader: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        backdropFilter: 'blur(20px)',
        border: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 20px',
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
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
        filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))',
        animation: 'pulse 2s infinite'
    },
    routeDisplay: {
        fontSize: 16,
        fontWeight: 600,
        color: '#00bfa6'
    },
    editSearchButton: {
        background: 'rgba(0,191,166,0.2)',
        color: '#00bfa6',
        border: '1px solid rgba(0,191,166,0.3)',
        padding: '6px 12px',
        borderRadius: 20,
        fontSize: 12,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    
    // Кнопка наверх
    backToTopButton: {
        position: 'fixed',
        bottom: 30,
        right: 20,
        background: 'linear-gradient(135deg, #00bfa6, #00d4aa)',
        color: 'black',
        border: 'none',
        borderRadius: 25,
        padding: '12px 16px',
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(0,191,166,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 700,
        transition: 'all 0.3s ease',
        zIndex: 50,
        animation: 'slideUp 0.3s ease-out'
    },
    backToTopIcon: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    backToTopText: {
        fontSize: 12,
        fontWeight: 700
    },
    
    // Компактный логотип в поиске
    compactLogoSection: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 20
    },
    compactLogoButton: {
        background: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    compactLogoIcon: {
        fontSize: 18,
        filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
    },
    compactBrandText: {
        fontSize: 16,
        fontWeight: 700,
        color: '#FFD700',
        textShadow: '0 0 10px rgba(255,215,0,0.3)'
    },
    
    // Страница About
    aboutPage: {
        width: '100%',
        maxWidth: 500,
        minHeight: 'calc(100vh - 40px)',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%)',
        borderRadius: 24,
        padding: 30,
        border: '2px solid rgba(255,215,0,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'slideIn 0.5s ease-out'
    },
    aboutHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    backFromAboutButton: {
        background: 'rgba(255,255,255,0.1)',
        color: '#aaa',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '8px 12px',
        borderRadius: 20,
        fontSize: 14,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    aboutTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
    },
    aboutLogo: {
        fontSize: 28,
        filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.8))',
        animation: 'logoGlow 3s ease-in-out infinite alternate'
    },
    aboutBrandTitle: {
        fontSize: 24,
        fontWeight: 800,
        margin: 0,
        background: 'linear-gradient(135deg, #FFD700, #00bfa6, #FFD700)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        backgroundSize: '200% 100%',
        animation: 'shimmerText 3s ease-in-out infinite'
    },
    aboutContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 30
    },
    
    // Секция миссии
    missionSection: {
        textAlign: 'center'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: '#FFD700',
        marginBottom: 16,
        textShadow: '0 0 10px rgba(255,215,0,0.3)'
    },
    missionText: {
        fontSize: 14,
        lineHeight: 1.6,
        color: '#ddd',
        margin: 0
    },
    
    // Секция статистики
    statsSection: {
        textAlign: 'center'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
    },
    statCard: {
        background: 'rgba(0,191,166,0.1)',
        border: '1px solid rgba(0,191,166,0.3)',
        borderRadius: 16,
        padding: 20,
        textAlign: 'center',
        transition: 'all 0.3s ease',
        animation: 'slideIn 0.6s ease-out'
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 8
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 800,
        color: '#00bfa6',
        marginBottom: 4,
        textShadow: '0 0 10px rgba(0,191,166,0.3)'
    },
    statLabel: {
        fontSize: 11,
        color: '#aaa',
        lineHeight: 1.2
    },
    
    // Секция видения
    visionSection: {
        textAlign: 'center'
    },
    visionGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
    visionCard: {
        background: 'rgba(255,215,0,0.05)',
        border: '1px solid rgba(255,215,0,0.2)',
        borderRadius: 16,
        padding: 20,
        textAlign: 'center',
        animation: 'slideIn 0.8s ease-out'
    },
    visionIcon: {
        fontSize: 20,
        marginBottom: 8
    },
    visionTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#FFD700',
        marginBottom: 6
    },
    visionText: {
        fontSize: 12,
        color: '#ccc',
        lineHeight: 1.4
    }
};

export default SearchCouriers;
