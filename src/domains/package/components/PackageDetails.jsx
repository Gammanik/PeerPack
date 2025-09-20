import React from 'react';

const PackageDetails = ({ 
    packageData, 
    setSelectedPackage,
    onSelectCourier
}) => {
    // Защищаемся от undefined responses
    const responses = packageData?.responses || [];
    const newResponses = responses.filter(r => r.isNew);
    const oldResponses = responses.filter(r => !r.isNew);
    const allResponses = [...newResponses, ...oldResponses];

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
        packageInfo: {
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
        description: {
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
        reward: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-button-color, #5288c1)'
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
        courierCard: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        newCourierCard: {
            background: 'rgba(255, 215, 0, 0.1)',
            border: '0.5px solid rgba(255, 215, 0, 0.6)',
            animation: 'pulse 2s infinite'
        },
        courierHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
        },
        courierInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: 12
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover'
        },
        courierName: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        courierRating: {
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #708499)'
        },
        price: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-button-color, #5288c1)'
        },
        courierDetails: {
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #708499)',
            marginBottom: 8
        },
        courierComment: {
            fontSize: 13,
            color: 'var(--tg-theme-text-color, #ffffff)',
            backgroundColor: 'rgba(75, 179, 75, 0.1)',
            padding: 8,
            borderRadius: 6
        },
        selectButton: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            marginTop: 12,
            width: '100%'
        },
        emptyState: {
            textAlign: 'center',
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 15,
            padding: '40px 20px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button 
                    style={styles.backButton}
                    onClick={() => setSelectedPackage(null)}
                >
                    ← Назад
                </button>
                <div style={styles.title}>Посылка #{packageData.id}</div>
                <div style={{ width: 50 }}></div>
            </div>

            <div style={styles.packageInfo}>
                <div style={styles.route}>{packageData.from} → {packageData.to}</div>
                <div style={styles.description}>📦 {packageData.description}</div>
                <div style={styles.message}>💬 {packageData.message}</div>
                <div style={styles.reward}>Вознаграждение: ₽{packageData.reward}</div>
            </div>

            {allResponses.length > 0 ? (
                <div>
                    <div style={styles.sectionTitle}>
                        👥 Отклики курьеров ({allResponses.length})
                        {newResponses.length > 0 && (
                            <span style={styles.newBadge}>
                                {newResponses.length} новых
                            </span>
                        )}
                    </div>

                    {allResponses.map((response, index) => (
                        <div 
                            key={response.courierId}
                            style={{
                                ...styles.courierCard,
                                ...(response.isNew ? styles.newCourierCard : {})
                            }}
                            onClick={() => onSelectCourier && onSelectCourier(packageData.id, response)}
                        >
                            <div style={styles.courierHeader}>
                                <div style={styles.courierInfo}>
                                    <img src={response.courier_avatar || response.courierAvatar} alt={response.courier_name || response.courierName} style={styles.avatar} />
                                    <div>
                                        <div style={styles.courierName}>
                                            {response.courier_name || response.courierName}
                                            {response.isNew && (
                                                <span style={{
                                                    ...styles.newBadge,
                                                    marginLeft: 8,
                                                    fontSize: 8
                                                }}>
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <div style={styles.courierRating}>⭐ {response.courier_rating || response.courierRating}</div>
                                    </div>
                                </div>
                                <div style={styles.price}>₽{response.price}</div>
                            </div>

                            <div style={styles.courierDetails}>
                                🛫 {response.airport} • 🕐 {response.time}
                            </div>
                            <div style={styles.courierDetails}>
                                🗓 {response.date}
                            </div>

                            {response.comment && (
                                <div style={styles.courierComment}>
                                    ✉️ {response.comment}
                                </div>
                            )}

                            {response.status === 'accepted' && packageData.status === 'active' && (
                                <button 
                                    style={styles.selectButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectCourier && onSelectCourier(packageData.id, response);
                                    }}
                                >
                                    Выбрать курьера
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={styles.emptyState}>
                    Пока нет откликов на эту посылку
                </div>
            )}
        </div>
    );
};

export default PackageDetails;