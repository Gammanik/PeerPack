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

    // todo: http get: /search?from=Moscow,to=Saint-Petersburg,date-from..,date-to,sorted_by=prise
    const handleSearch = () => {
        const lowerFrom = from.trim().toLowerCase();
        const lowerTo = to.trim().toLowerCase();
        const filtered = couriers.filter(c =>
            c.from.toLowerCase() === lowerFrom &&
            c.to.toLowerCase() === lowerTo
        );
        setResults(filtered);
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
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>Найти курьера</h1>
                <p style={styles.subtitle}>Передайте посылку с попутчиками</p>
            </div>

            {mode === 'search' ? (
                <>
                    <div style={styles.container}>
                        <label style={styles.label}>Откуда</label>
                        <input
                            list="available-cities"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder="Например, Москва"
                            style={styles.input}
                        />
                        <label style={styles.label}>Куда</label>
                        <input
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
                            style={styles.button} 
                            onClick={handleSearch}
                        >
                            Найти курьеров
                        </button>
                    </div>

                    <div style={{ width: '100%', maxWidth: 400, marginTop: 30 }}>
                        {results.length === 0 ? (
                            <p style={{ color: '#aaa' }}>Курьеры не найдены.</p>
                        ) : results.map((c, index) => (
                            <div 
                                key={c.name + c.date} 
                                className="card-hover"
                                style={{
                                    ...styles.card, 
                                    cursor: 'pointer',
                                    animationDelay: `${index * 0.1}s`
                                }}
                                onClick={() => handleCourierClick(c)}
                            >
                                <img src={c.avatar} alt={c.name} style={styles.avatar} />
                                <div style={styles.cardContent}>
                                    <div style={styles.courierHeader}>
                                        <strong>{c.name}</strong>
                                        <div style={styles.courierStats}>
                                            <span style={styles.trips}>{c.tripsCount} поездок</span>
                                            {getRequestStatus(c) && (
                                                <span style={getStatusStyle(getRequestStatus(c))}>
                                                    {getStatusText(getRequestStatus(c))}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={styles.rating}>
                                        <span style={styles.stars}>{renderStars(c.rating)}</span>
                                        <span style={styles.ratingText}>{c.rating} ({c.reviewsCount} отзывов)</span>
                                    </div>
                                    <div style={styles.cardRoute}>{c.from} → {c.to}</div>
                                    <small>{c.date}, {c.time}</small><br />
                                    <small>Аэропорт: {c.airport}</small>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.courierLinkContainer}>
                        <button 
                            style={styles.courierLink}
                            onClick={() => setMode('add')}
                        >
                            Вы доставитель? Добавить поездку
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
        </div>
    );
};

const styles = {
    page: {
        background: '#1e1e1e',
        color: '#fff',
        minHeight: '100vh',
        padding: '30px 15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'system-ui, sans-serif'
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
    header: {
        textAlign: 'center',
        marginBottom: 30
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        margin: 0,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        margin: 0
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
        padding: 10,
        width: '100%',
        background: '#1c1c1c',
        border: '1px solid #3a3a3a',
        borderRadius: 8,
        color: 'white',
        fontSize: 15
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
    courierInfo: {
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
    }
};

export default SearchCouriers;
