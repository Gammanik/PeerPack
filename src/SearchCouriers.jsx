import React, { useState } from 'react';

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
        reviewsCount: 32
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
        reviewsCount: 18
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
        reviewsCount: 67
    }
];

const SearchCouriers = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [results, setResults] = useState([]);
    const [mode, setMode] = useState('search'); // 'search' or 'add'
    const [newTrip, setNewTrip] = useState({
        name: '',
        from: '',
        to: '',
        date: '',
        time: '',
        airport: ''
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
                reviewsCount: 0
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
                        <button style={styles.button} onClick={handleSearch}>Найти</button>
                    </div>

                    <div style={{ width: '100%', maxWidth: 400, marginTop: 30 }}>
                        {results.length === 0 ? (
                            <p style={{ color: '#aaa' }}>Курьеры не найдены.</p>
                        ) : results.map(c => (
                            <div key={c.name + c.date} style={styles.card}>
                                <img src={c.avatar} alt={c.name} style={styles.avatar} />
                                <div style={styles.cardContent}>
                                    <div style={styles.courierHeader}>
                                        <strong>{c.name}</strong>
                                        <div style={styles.courierStats}>
                                            <span style={styles.trips}>{c.tripsCount} поездок</span>
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
        cursor: 'pointer'
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
        boxShadow: '0 0 10px rgba(0,0,0,0.2)'
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
    }
};

export default SearchCouriers;
