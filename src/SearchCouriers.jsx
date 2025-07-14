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
        avatar: 'https://i.pravatar.cc/100?img=12'
    },
    {
        name: 'Анна',
        from: 'Казань',
        to: 'Екатеринбург',
        date: '2025-07-18',
        time: '09:30 → 12:10',
        airport: 'Казань → Кольцово',
        avatar: 'https://i.pravatar.cc/100?img=25'
    },
    {
        name: 'Олег',
        from: 'Москва',
        to: 'Сочи',
        date: '2025-07-20',
        time: '15:00 → 17:30',
        airport: 'Внуково → Адлер',
        avatar: 'https://i.pravatar.cc/100?img=33'
    }
];

const SearchCouriers = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [results, setResults] = useState([]);

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

    return (
        <div style={styles.page}>
            <h2 style={styles.heading}>Найти курьера</h2>
            <div style={styles.container}>
                <label style={styles.label}>Откуда</label>
                <input
                    list="city-list"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Например, Москва"
                    style={styles.input}
                />
                <label style={styles.label}>Куда</label>
                <input
                    list="city-list"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Например, Сочи"
                    style={styles.input}
                />
                <datalist id="city-list">
                    {cities.map(city => (
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
                            <strong>{c.name}</strong><br />
                            <div style={styles.cardRoute}>{c.from} → {c.to}</div>
                            <small>{c.date}, {c.time}</small><br />
                            <small>Аэропорт: {c.airport}</small>
                        </div>
                    </div>
                ))}
            </div>
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
    heading: {
        marginBottom: 20
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
        marginTop: 4,
        fontSize: 14
    }
};

export default SearchCouriers;
