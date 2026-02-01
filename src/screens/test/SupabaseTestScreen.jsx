import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase.js';
import supabaseApi from '../../services/supabaseApi.js';

const SupabaseTestScreen = () => {
    const [connectionStatus, setConnectionStatus] = useState('checking');
    const [currentUser, setCurrentUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Тестовые данные пользователя
    const testTelegramUser = {
        id: 123456789,
        username: 'test_user',
        first_name: 'Тест',
        last_name: 'Пользователь',
        photo_url: 'https://i.pravatar.cc/100?img=1'
    };

    // Проверка подключения при загрузке
    useEffect(() => {
        checkConnection();
        loadData();
    }, []);

    const checkConnection = async () => {
        try {
            const { data, error } = await supabase.from('users').select('count').limit(1);
            if (error) {
                setConnectionStatus('error');
                setMessage(`❌ Ошибка подключения: ${error.message}`);
            } else {
                setConnectionStatus('connected');
                setMessage('✅ Подключение к Supabase установлено');
            }
        } catch (err) {
            setConnectionStatus('error');
            setMessage(`❌ Ошибка: ${err.message}`);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [tripsResult, parcelsResult] = await Promise.all([
                supabaseApi.getTrips(),
                supabaseApi.getParcels()
            ]);

            setTrips(tripsResult.trips || []);
            setParcels(parcelsResult.parcels || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetOrCreateUser = async () => {
        setLoading(true);
        try {
            const { user, error } = await supabaseApi.getOrCreateUser(testTelegramUser);
            if (error) {
                setMessage(`❌ Ошибка: ${error.message}`);
            } else {
                setCurrentUser(user);
                setMessage(`✅ Пользователь: ${user.full_name} (ID: ${user.id})`);
            }
        } catch (error) {
            setMessage(`❌ Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTestTrip = async () => {
        if (!currentUser) {
            setMessage('❌ Сначала создайте/загрузите пользователя');
            return;
        }

        setLoading(true);
        try {
            const tripData = {
                user_id: currentUser.id,
                origin: 'Москва, Россия',
                destination: 'Дубай, ОАЭ',
                depart_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                capacity_kg: 10,
                price_per_kg: 50.00,
                description: 'Тестовая поездка - командировка в Дубай'
            };

            const result = await supabaseApi.createTrip(tripData);
            if (result.error) {
                setMessage(`❌ Ошибка создания поездки: ${result.error.message}`);
            } else {
                setMessage(`✅ Поездка создана! ID: ${result.trip_id}`);
                await loadData();
            }
        } catch (error) {
            setMessage(`❌ Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTestParcel = async () => {
        if (!currentUser) {
            setMessage('❌ Сначала создайте/загрузите пользователя');
            return;
        }

        setLoading(true);
        try {
            const parcelData = {
                user_id: currentUser.id,
                title: 'Тестовая посылка - Документы',
                origin: 'Москва, Россия',
                destination: 'Дубай, ОАЭ',
                weight_kg: 0.5,
                reward: 1500.00,
                description: 'Срочные документы для визы',
                pickup_address: 'ул. Тверская, 1',
                delivery_address: 'Dubai Mall'
            };

            const result = await supabaseApi.createParcel(parcelData);
            if (result.error) {
                setMessage(`❌ Ошибка создания посылки: ${result.error.message}`);
            } else {
                setMessage(`✅ Посылка создана! ID: ${result.parcel_id}`);
                await loadData();
            }
        } catch (error) {
            setMessage(`❌ Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTestOffer = async () => {
        if (!currentUser) {
            setMessage('❌ Сначала создайте/загрузите пользователя');
            return;
        }

        if (trips.length === 0 || parcels.length === 0) {
            setMessage('❌ Сначала создайте поездку и посылку');
            return;
        }

        setLoading(true);
        try {
            const offerData = {
                trip_id: trips[0].id,
                parcel_id: parcels[0].id,
                user_id: currentUser.id,
                type: 'parcel_to_trip',
                price: 1400.00,
                message: 'Тестовый отклик - могу доставить вашу посылку'
            };

            const result = await supabaseApi.createOffer(offerData);
            if (result.error) {
                setMessage(`❌ Ошибка создания отклика: ${result.error.message}`);
            } else {
                setMessage(`✅ Отклик создан! ID: ${result.offer_id}`);
            }
        } catch (error) {
            setMessage(`❌ Ошибка: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            background: 'var(--tg-theme-bg-color, #17212b)',
            minHeight: '100vh',
            padding: '20px',
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        header: {
            marginBottom: '24px'
        },
        title: {
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px'
        },
        statusBadge: {
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            backgroundColor: connectionStatus === 'connected' ? '#4BB34B' :
                           connectionStatus === 'error' ? '#ff4444' : '#FFD700',
            color: 'white'
        },
        section: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
            color: 'var(--tg-theme-accent-text-color, #64b5ef)'
        },
        button: {
            width: '100%',
            padding: '12px',
            marginBottom: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        buttonDisabled: {
            opacity: 0.5,
            cursor: 'not-allowed'
        },
        message: {
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(100, 181, 239, 0.1)',
            border: '1px solid rgba(100, 181, 239, 0.3)',
            fontSize: '14px',
            marginTop: '12px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
        },
        userInfo: {
            padding: '12px',
            backgroundColor: 'rgba(75, 179, 75, 0.1)',
            borderRadius: '8px',
            fontSize: '14px',
            marginTop: '8px'
        },
        list: {
            marginTop: '12px'
        },
        listItem: {
            padding: '12px',
            backgroundColor: 'var(--tg-theme-bg-color, #17212b)',
            borderRadius: '8px',
            marginBottom: '8px',
            fontSize: '13px'
        },
        label: {
            fontWeight: '600',
            color: 'var(--tg-theme-hint-color, #708499)',
            marginRight: '8px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.title}>🧪 Тест Supabase</div>
                <div style={styles.statusBadge}>
                    {connectionStatus === 'checking' && 'Проверка подключения...'}
                    {connectionStatus === 'connected' && '✅ Подключено'}
                    {connectionStatus === 'error' && '❌ Ошибка подключения'}
                </div>
            </div>

            {/* Секция подключения */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>1️⃣ Проверка подключения</div>
                <button
                    style={styles.button}
                    onClick={checkConnection}
                    disabled={loading}
                >
                    Проверить подключение
                </button>
                {message && <div style={styles.message}>{message}</div>}
            </div>

            {/* Секция пользователя */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>2️⃣ Пользователь</div>
                <button
                    style={styles.button}
                    onClick={handleGetOrCreateUser}
                    disabled={loading}
                >
                    Создать/Загрузить тестового пользователя
                </button>
                {currentUser && (
                    <div style={styles.userInfo}>
                        <div><span style={styles.label}>ID:</span>{currentUser.id}</div>
                        <div><span style={styles.label}>Имя:</span>{currentUser.full_name}</div>
                        <div><span style={styles.label}>Telegram:</span>@{currentUser.telegram_username}</div>
                        <div><span style={styles.label}>Рейтинг:</span>⭐ {currentUser.rating}</div>
                    </div>
                )}
            </div>

            {/* Секция создания данных */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>3️⃣ Создание тестовых данных</div>
                <button
                    style={{
                        ...styles.button,
                        ...((!currentUser || loading) && styles.buttonDisabled)
                    }}
                    onClick={handleCreateTestTrip}
                    disabled={!currentUser || loading}
                >
                    Создать тестовую поездку
                </button>
                <button
                    style={{
                        ...styles.button,
                        ...((!currentUser || loading) && styles.buttonDisabled)
                    }}
                    onClick={handleCreateTestParcel}
                    disabled={!currentUser || loading}
                >
                    Создать тестовую посылку
                </button>
                <button
                    style={{
                        ...styles.button,
                        ...((!currentUser || loading || trips.length === 0 || parcels.length === 0) && styles.buttonDisabled)
                    }}
                    onClick={handleCreateTestOffer}
                    disabled={!currentUser || loading || trips.length === 0 || parcels.length === 0}
                >
                    Создать тестовый отклик
                </button>
            </div>

            {/* Секция поездок */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>
                    🚗 Поездки ({trips.length})
                    <button
                        style={{
                            ...styles.button,
                            marginLeft: '12px',
                            width: 'auto',
                            padding: '6px 12px',
                            marginBottom: 0,
                            fontSize: '12px'
                        }}
                        onClick={loadData}
                        disabled={loading}
                    >
                        🔄 Обновить
                    </button>
                </div>
                <div style={styles.list}>
                    {trips.map(trip => (
                        <div key={trip.id} style={styles.listItem}>
                            <div><span style={styles.label}>ID:</span>{trip.id}</div>
                            <div><span style={styles.label}>Маршрут:</span>{trip.origin} → {trip.destination}</div>
                            <div><span style={styles.label}>Дата:</span>{new Date(trip.depart_at).toLocaleString('ru-RU')}</div>
                            <div><span style={styles.label}>Вместимость:</span>{trip.capacity_kg} кг</div>
                            <div><span style={styles.label}>Цена:</span>{trip.price_per_kg} ₽/кг</div>
                        </div>
                    ))}
                    {trips.length === 0 && (
                        <div style={{...styles.message, backgroundColor: 'rgba(255, 215, 0, 0.1)'}}>
                            Поездок пока нет. Создайте тестовую поездку.
                        </div>
                    )}
                </div>
            </div>

            {/* Секция посылок */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>📦 Посылки ({parcels.length})</div>
                <div style={styles.list}>
                    {parcels.map(parcel => (
                        <div key={parcel.id} style={styles.listItem}>
                            <div><span style={styles.label}>ID:</span>{parcel.id}</div>
                            <div><span style={styles.label}>Название:</span>{parcel.title}</div>
                            <div><span style={styles.label}>Маршрут:</span>{parcel.origin} → {parcel.destination}</div>
                            <div><span style={styles.label}>Вес:</span>{parcel.weight_kg} кг</div>
                            <div><span style={styles.label}>Вознаграждение:</span>{parcel.reward} ₽</div>
                            <div><span style={styles.label}>Статус:</span>{parcel.status}</div>
                        </div>
                    ))}
                    {parcels.length === 0 && (
                        <div style={{...styles.message, backgroundColor: 'rgba(255, 215, 0, 0.1)'}}>
                            Посылок пока нет. Создайте тестовую посылку.
                        </div>
                    )}
                </div>
            </div>

            {loading && (
                <div style={{
                    ...styles.message,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                }}>
                    ⏳ Загрузка...
                </div>
            )}
        </div>
    );
};

export default SupabaseTestScreen;
