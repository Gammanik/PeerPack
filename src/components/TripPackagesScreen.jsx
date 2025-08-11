import React from 'react';
import { useTripRequests } from '../hooks/useApi';

const TripPackagesScreen = ({ 
    trip, 
    onBack
}) => {
    const { 
        requests: packageRequests, 
        loading, 
        error, 
        acceptRequest, 
        markDelivered 
    } = useTripRequests(trip.id);
    const tripPackages = packageRequests.filter(pkg => pkg.trip_id === trip.id);
    const pendingPackages = tripPackages.filter(pkg => pkg.status === 'pending');
    const acceptedPackages = tripPackages.filter(pkg => pkg.status === 'accepted');
    const deliveredPackages = tripPackages.filter(pkg => pkg.status === 'delivered');
    const confirmedPackages = tripPackages.filter(pkg => pkg.status === 'confirmed');

    const styles = {
        container: {
            width: '100%',
            maxWidth: 480,
            minHeight: '100vh',
            background: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-text-color, #ffffff)',
            padding: '16px'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '0.5px solid var(--tg-theme-hint-color, #708499)'
        },
        backButton: {
            background: 'transparent',
            border: 'none',
            color: 'var(--tg-theme-link-color, #64b5ef)',
            fontSize: 16,
            cursor: 'pointer',
            fontWeight: 500
        },
        title: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)',
            textAlign: 'center',
            flex: 1
        },
        tripInfo: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20
        },
        route: {
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)',
            marginBottom: 8
        },
        tripDetails: {
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #708499)',
            marginBottom: 4
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8
        },
        newBadge: {
            background: '#FFD700',
            color: '#1a1a1a',
            padding: '2px 6px',
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 600
        },
        packageCard: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12
        },
        newPackageCard: {
            background: 'rgba(255, 215, 0, 0.1)',
            border: '0.5px solid rgba(255, 215, 0, 0.6)',
            animation: 'pulse 2s infinite'
        },
        deliveredPackageCard: {
            background: 'rgba(255, 140, 0, 0.1)',
            border: '0.5px solid rgba(255, 140, 0, 0.3)'
        },
        confirmedPackageCard: {
            background: 'rgba(75, 179, 75, 0.1)',
            border: '0.5px solid rgba(75, 179, 75, 0.3)'
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
        },
        senderInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: 12
        },
        avatar: {
            width: 36,
            height: 36,
            borderRadius: '50%',
            objectFit: 'cover'
        },
        senderName: {
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        reward: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-button-color, #5288c1)'
        },
        packageInfo: {
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #708499)',
            marginBottom: 8
        },
        message: {
            fontSize: 13,
            color: 'var(--tg-theme-text-color, #ffffff)',
            backgroundColor: 'rgba(100, 181, 239, 0.1)',
            padding: 8,
            borderRadius: 6,
            marginBottom: 8
        },
        locationInfo: {
            fontSize: 12,
            color: 'var(--tg-theme-hint-color, #708499)',
            marginBottom: 12
        },
        actionButton: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%'
        },
        acceptButton: {
            background: '#4BB34B'
        },
        deliveredButton: {
            background: '#FF8C00'
        },
        emptyState: {
            textAlign: 'center',
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 15,
            padding: '40px 20px'
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <button style={styles.backButton} onClick={onBack}>← Назад</button>
                    <div style={styles.title}>Посылки для поездки</div>
                    <div style={{ width: 50 }}></div>
                </div>
                <div style={styles.emptyState}>Загрузка заявок...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <button style={styles.backButton} onClick={onBack}>← Назад</button>
                    <div style={styles.title}>Посылки для поездки</div>
                    <div style={{ width: 50 }}></div>
                </div>
                <div style={styles.emptyState}>Ошибка загрузки: {error}</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button 
                    style={styles.backButton}
                    onClick={onBack}
                >
                    ← Назад
                </button>
                <div style={styles.title}>Посылки для поездки</div>
                <div style={{ width: 50 }}></div>
            </div>

            <div style={styles.tripInfo}>
                <div style={styles.route}>{trip.from} → {trip.to}</div>
                <div style={styles.tripDetails}>🛫 {trip.airport}</div>
                <div style={styles.tripDetails}>🕐 {trip.time} • 🗓 {trip.date}</div>
            </div>

            {pendingPackages.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <div style={styles.sectionTitle}>
                        📥 Новые запросы ({pendingPackages.length})
                        {pendingPackages.some(p => p.is_new) && (
                            <span style={styles.newBadge}>NEW</span>
                        )}
                    </div>
                    
                    {pendingPackages.map(packageReq => (
                        <div 
                            key={packageReq.id}
                            style={{
                                ...styles.packageCard,
                                ...(packageReq.is_new ? styles.newPackageCard : {})
                            }}
                        >
                            <div style={styles.cardHeader}>
                                <div style={styles.senderInfo}>
                                    <img src={packageReq.sender_avatar} alt={packageReq.sender_name} style={styles.avatar} />
                                    <div>
                                        <div style={styles.senderName}>
                                            {packageReq.sender_name}
                                            {packageReq.is_new && (
                                                <span style={{
                                                    ...styles.newBadge,
                                                    marginLeft: 8,
                                                    fontSize: 8
                                                }}>NEW</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.reward}>₽{packageReq.reward}</div>
                            </div>

                            <div style={styles.packageInfo}>
                                📦 {packageReq.package_description}
                            </div>
                            
                            <div style={styles.message}>
                                💬 {packageReq.message}
                            </div>

                            <div style={styles.locationInfo}>
                                📍 Забрать: {packageReq.pickup_location}
                                <br />
                                📍 Доставить: {packageReq.delivery_location}
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: 8
                            }}>
                                <button 
                                    style={{
                                        ...styles.actionButton,
                                        backgroundColor: 'var(--tg-theme-link-color, #64b5ef)',
                                        flex: 1
                                    }}
                                    onClick={() => {
                                        const telegramUrl = `https://t.me/${packageReq.sender_telegram || packageReq.sender_name.toLowerCase().replace(' ', '_')}`;
                                        window.open(telegramUrl, '_blank');
                                    }}
                                >
                                    💬 Написать
                                </button>
                                <button 
                                    style={{
                                        ...styles.actionButton,
                                        ...styles.acceptButton,
                                        flex: 2
                                    }}
                                    onClick={() => acceptRequest(packageReq.id)}
                                >
                                    Принять заявку
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {acceptedPackages.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <div style={styles.sectionTitle}>
                        📦 Принятые посылки ({acceptedPackages.length})
                    </div>
                    
                    {acceptedPackages.map(packageReq => (
                        <div key={packageReq.id} style={styles.packageCard}>
                            <div style={styles.cardHeader}>
                                <div style={styles.senderInfo}>
                                    <img src={packageReq.sender_avatar} alt={packageReq.sender_name} style={styles.avatar} />
                                    <div style={styles.senderName}>{packageReq.sender_name}</div>
                                </div>
                                <div style={styles.reward}>₽{packageReq.reward}</div>
                            </div>

                            <div style={styles.packageInfo}>
                                📦 {packageReq.package_description}
                            </div>

                            <div style={styles.locationInfo}>
                                📍 Забрать: {packageReq.pickup_location}
                                <br />
                                📍 Доставить: {packageReq.delivery_location}
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: 8
                            }}>
                                <button 
                                    style={{
                                        ...styles.actionButton,
                                        backgroundColor: 'var(--tg-theme-link-color, #64b5ef)',
                                        flex: 1
                                    }}
                                    onClick={() => {
                                        const telegramUrl = `https://t.me/${packageReq.sender_telegram || packageReq.sender_name.toLowerCase().replace(' ', '_')}`;
                                        window.open(telegramUrl, '_blank');
                                    }}
                                >
                                    💬 Написать
                                </button>
                                <button 
                                    style={{
                                        ...styles.actionButton,
                                        ...styles.deliveredButton,
                                        flex: 2
                                    }}
                                    onClick={() => markDelivered(packageReq.id)}
                                >
                                    ✅ Доставлено
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deliveredPackages.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    <div style={styles.sectionTitle}>
                        ⏳ Ожидают подтверждения ({deliveredPackages.length})
                    </div>
                    
                    {deliveredPackages.map(packageReq => (
                        <div key={packageReq.id} style={{
                            ...styles.packageCard,
                            ...styles.deliveredPackageCard
                        }}>
                            <div style={styles.cardHeader}>
                                <div style={styles.senderInfo}>
                                    <img src={packageReq.sender_avatar} alt={packageReq.sender_name} style={styles.avatar} />
                                    <div style={styles.senderName}>{packageReq.sender_name}</div>
                                </div>
                                <div style={{
                                    fontSize: 12,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    background: '#FF8C00',
                                    color: 'white',
                                    fontWeight: 500
                                }}>
                                    ₽{packageReq.reward}
                                </div>
                            </div>

                            <div style={styles.packageInfo}>
                                📦 {packageReq.package_description}
                            </div>

                            <div style={{
                                fontSize: 12,
                                color: '#FF8C00',
                                fontWeight: 500,
                                marginTop: 8
                            }}>
                                ⏳ Ожидание подтверждения от получателя
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {confirmedPackages.length > 0 && (
                <div>
                    <div style={styles.sectionTitle}>
                        ✅ Подтвержденные ({confirmedPackages.length})
                    </div>
                    
                    {confirmedPackages.map(packageReq => (
                        <div key={packageReq.id} style={{
                            ...styles.packageCard,
                            ...styles.confirmedPackageCard
                        }}>
                            <div style={styles.cardHeader}>
                                <div style={styles.senderInfo}>
                                    <img src={packageReq.sender_avatar} alt={packageReq.sender_name} style={styles.avatar} />
                                    <div style={styles.senderName}>{packageReq.sender_name}</div>
                                </div>
                                <div style={{
                                    fontSize: 12,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    background: '#4BB34B',
                                    color: 'white',
                                    fontWeight: 500
                                }}>
                                    +₽{packageReq.reward}
                                </div>
                            </div>

                            <div style={styles.packageInfo}>
                                📦 {packageReq.package_description}
                            </div>

                            <div style={{
                                fontSize: 12,
                                color: '#4BB34B',
                                fontWeight: 500
                            }}>
                                ✅ Доставлено и подтверждено получателем
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tripPackages.length === 0 && (
                <div style={styles.emptyState}>
                    Пока нет заявок на доставку для этой поездки
                </div>
            )}
        </div>
    );
};

export default TripPackagesScreen;