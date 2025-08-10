import React, { useState } from 'react';

const ProfilePage = ({ 
    setShowProfilePage, 
    myPackages,
    userTrips,
    setSelectedPackage
}) => {
    const [activeTab, setActiveTab] = useState('packages');

    const activePackages = myPackages.filter(pkg => pkg.status === 'active' || pkg.status === 'waiting');
    const completedPackages = myPackages.filter(pkg => pkg.status === 'completed');

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
            marginBottom: 24,
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
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        tabs: {
            display: 'flex',
            marginBottom: 20,
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            borderRadius: 8,
            padding: 4
        },
        tab: {
            flex: 1,
            padding: '8px 12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            borderRadius: 6,
            transition: 'all 0.2s ease'
        },
        activeTab: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)'
        },
        requestCard: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12
        },
        userTripCard: {
            background: 'rgba(112, 132, 153, 0.1)',
            border: '0.5px solid rgba(112, 132, 153, 0.3)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            opacity: 0.8
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
        },
        route: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        status: {
            padding: '4px 8px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 500
        },
        details: {
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
            marginTop: 8
        },
        emptyState: {
            textAlign: 'center',
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 15,
            padding: '40px 20px'
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#FFD700', color: '#1a1a1a' };
            case 'accepted': return { bg: '#4BB34B', color: 'white' };
            case 'declined': return { bg: '#FF3333', color: 'white' };
            default: return { bg: '#708499', color: 'white' };
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Ожидание ответа';
            case 'accepted': return 'Принята';
            case 'declined': return 'Отказано';
            default: return '';
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button 
                    style={styles.backButton}
                    onClick={() => setShowProfilePage(false)}
                >
                    ← Назад
                </button>
                <div style={styles.title}>Профиль</div>
                <div style={{ width: 50 }}></div>
            </div>

            <div style={styles.tabs}>
                <button 
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'packages' ? styles.activeTab : {})
                    }}
                    onClick={() => setActiveTab('packages')}
                >
                    📦 Мои посылки ({myPackages.length})
                </button>
                <button 
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'trips' ? styles.activeTab : {})
                    }}
                    onClick={() => setActiveTab('trips')}
                >
                    ✈️ Мои поездки ({userTrips.length})
                </button>
            </div>

            {activeTab === 'packages' ? (
                <div>
                    {activePackages.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: 'var(--tg-theme-text-color, #ffffff)',
                                marginBottom: 12
                            }}>Активные посылки</h3>
                            
                            {activePackages.map(packageData => {
                                const hasNewResponses = packageData.responses.some(r => r.isNew);
                                const responsesCount = packageData.responses.length;
                                return (
                                    <div 
                                        key={packageData.id} 
                                        style={{
                                            ...styles.requestCard,
                                            cursor: 'pointer',
                                            ...(hasNewResponses ? {
                                                border: '0.5px solid rgba(255, 215, 0, 0.6)',
                                                background: 'rgba(255, 215, 0, 0.05)'
                                            } : {})
                                        }}
                                        onClick={() => setSelectedPackage(packageData)}
                                    >
                                        <div style={styles.cardHeader}>
                                            <div style={styles.route}>{packageData.from} → {packageData.to}</div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8
                                            }}>
                                                {hasNewResponses && (
                                                    <div style={{
                                                        background: '#FFD700',
                                                        color: '#1a1a1a',
                                                        padding: '2px 6px',
                                                        borderRadius: 8,
                                                        fontSize: 10,
                                                        fontWeight: 600
                                                    }}>
                                                        NEW
                                                    </div>
                                                )}
                                                <div style={{
                                                    ...styles.status,
                                                    backgroundColor: packageData.status === 'active' ? '#4BB34B' : '#FFD700',
                                                    color: packageData.status === 'active' ? 'white' : '#1a1a1a'
                                                }}>
                                                    {responsesCount} откликов
                                                </div>
                                            </div>
                                        </div>
                                        <div style={styles.details}>
                                            📦 {packageData.description} • ₽{packageData.reward}
                                        </div>
                                        {packageData.message && (
                                            <div style={styles.message}>💬 {packageData.message}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {completedPackages.length > 0 && (
                        <div>
                            <h3 style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: 'var(--tg-theme-text-color, #ffffff)',
                                marginBottom: 12
                            }}>Завершенные</h3>
                            
                            {completedPackages.map(packageData => (
                                <div key={packageData.id} style={styles.requestCard}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.route}>{packageData.from} → {packageData.to}</div>
                                        <div style={{
                                            ...styles.status,
                                            backgroundColor: '#4BB34B',
                                            color: 'white'
                                        }}>
                                            Доставлено
                                        </div>
                                    </div>
                                    <div style={styles.details}>
                                        📦 {packageData.description} • ₽{packageData.reward}
                                    </div>
                                    <div style={styles.details}>
                                        👤 Курьер: {packageData.selectedCourier}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {myPackages.length === 0 && (
                        <div style={styles.emptyState}>
                            У вас пока нет посылок
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {userTrips.map((trip, index) => (
                        <div key={index} style={styles.userTripCard}>
                            <div style={styles.cardHeader}>
                                <div style={styles.route}>{trip.from} → {trip.to}</div>
                                <div style={{
                                    ...styles.status,
                                    backgroundColor: '#708499',
                                    color: 'white'
                                }}>
                                    Ваша поездка
                                </div>
                            </div>
                            <div style={styles.details}>
                                🛫 {trip.airport} • 🕐 {trip.time}
                            </div>
                            <div style={styles.details}>
                                🗓 {trip.date} • ₽{trip.price}
                            </div>
                            <div style={styles.message}>
                                💬 {trip.tripComment}
                            </div>
                        </div>
                    ))}

                    {userTrips.length === 0 && (
                        <div style={styles.emptyState}>
                            <div style={{ marginBottom: 16 }}>У вас пока нет поездок</div>
                            <button
                                onClick={() => {
                                    setShowProfilePage(false);
                                    // Переключаемся в режим добавления поездки
                                    window.dispatchEvent(new CustomEvent('switchToAddTrip'));
                                }}
                                style={{
                                    background: 'var(--tg-theme-button-color, #5288c1)',
                                    color: 'var(--tg-theme-button-text-color, #ffffff)',
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '12px 24px',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                + Добавить поездку
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;