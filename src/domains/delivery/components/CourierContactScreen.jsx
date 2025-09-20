import React from 'react';

const CourierContactScreen = ({ 
    courier, 
    packageData,
    onBack
}) => {
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
        successCard: {
            background: 'rgba(75, 179, 75, 0.1)',
            border: '0.5px solid rgba(75, 179, 75, 0.3)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            textAlign: 'center'
        },
        successIcon: {
            fontSize: 48,
            marginBottom: 12
        },
        successTitle: {
            fontSize: 18,
            fontWeight: 600,
            color: '#4BB34B',
            marginBottom: 8
        },
        successText: {
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #708499)',
            lineHeight: 1.4
        },
        courierCard: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20
        },
        courierHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: '50%',
            objectFit: 'cover'
        },
        courierName: {
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        courierRating: {
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #708499)',
            marginTop: 2
        },
        flightInfo: {
            fontSize: 14,
            color: 'var(--tg-theme-text-color, #ffffff)',
            marginBottom: 8
        },
        telegramContact: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: 'none',
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
        },
        contactNote: {
            background: 'rgba(100, 181, 239, 0.1)',
            border: '0.5px solid rgba(100, 181, 239, 0.3)',
            borderRadius: 12,
            padding: 16,
            fontSize: 14,
            color: 'var(--tg-theme-text-color, #ffffff)',
            lineHeight: 1.4,
            textAlign: 'center'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button 
                    style={styles.backButton}
                    onClick={onBack}
                >
                    ← Назад
                </button>
                <div style={styles.title}>Связь с курьером</div>
                <div style={{ width: 50 }}></div>
            </div>

            <div style={styles.successCard}>
                <div style={styles.successIcon}>✅</div>
                <div style={styles.successTitle}>Курьер выбран!</div>
                <div style={styles.successText}>
                    Теперь вы можете связаться с курьером для уточнения деталей доставки
                </div>
            </div>

            <div style={styles.courierCard}>
                <div style={styles.courierHeader}>
                    <img src={courier.courier_avatar || courier.courierAvatar} alt={courier.courier_name || courier.courierName} style={styles.avatar} />
                    <div>
                        <div style={styles.courierName}>{courier.courier_name || courier.courierName}</div>
                        <div style={styles.courierRating}>⭐ {courier.courier_rating || courier.courierRating} • ₽{courier.price}</div>
                    </div>
                </div>
                <div style={styles.flightInfo}>
                    🛫 {courier.airport}
                </div>
                <div style={styles.flightInfo}>
                    🕐 {courier.time} • 🗓 {courier.date}
                </div>
            </div>

            <button 
                style={styles.telegramContact}
                onClick={() => {
                    // В реальном приложении - открытие Telegram
                    const telegramUrl = `https://t.me/${courier.telegramUsername || (courier.courier_name || courier.courierName).toLowerCase()}`;
                    window.open(telegramUrl, '_blank');
                }}
            >
                💬 Написать в Telegram
            </button>

            <div style={styles.contactNote}>
                📱 Свяжитесь с курьером через Telegram для договоренности о деталях передачи посылки: 
                место встречи, время и способ оплаты (₽{packageData.reward}).
            </div>
        </div>
    );
};

export default CourierContactScreen;