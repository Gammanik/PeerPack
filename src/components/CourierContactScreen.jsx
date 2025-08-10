import React from 'react';

const CourierContactScreen = ({ 
    courier, 
    packageData,
    onBack,
    onPaymentConfirm
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
        escrowInfo: {
            background: 'rgba(100, 181, 239, 0.1)',
            border: '0.5px solid rgba(100, 181, 239, 0.3)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20
        },
        escrowTitle: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-accent-text-color, #64b5ef)',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8
        },
        escrowText: {
            fontSize: 13,
            color: 'var(--tg-theme-text-color, #ffffff)',
            lineHeight: 1.4,
            marginBottom: 8
        },
        starsWarning: {
            background: 'rgba(255, 215, 0, 0.1)',
            border: '0.5px solid rgba(255, 215, 0, 0.3)',
            borderRadius: 8,
            padding: 12,
            fontSize: 12,
            color: 'var(--tg-theme-hint-color, #708499)',
            lineHeight: 1.3
        },
        confirmButton: {
            background: '#4BB34B',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '16px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            marginTop: 20
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
                    <img src={courier.courierAvatar} alt={courier.courierName} style={styles.avatar} />
                    <div>
                        <div style={styles.courierName}>{courier.courierName}</div>
                        <div style={styles.courierRating}>⭐ {courier.courierRating} • ₽{courier.price}</div>
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
                    window.open(`https://t.me/${courier.courierName.toLowerCase()}`, '_blank');
                }}
            >
                💬 Написать в Telegram
            </button>

            <div style={styles.escrowInfo}>
                <div style={styles.escrowTitle}>
                    🛡️ Гарантия безопасности
                </div>
                <div style={styles.escrowText}>
                    • Деньги заблокированы на платформе до подтверждения доставки
                </div>
                <div style={styles.escrowText}>
                    • Курьер получит оплату только после успешной доставки
                </div>
                <div style={styles.escrowText}>
                    • При спорах - служба поддержки разберет ситуацию
                </div>
                <div style={styles.starsWarning}>
                    ⚠️ Внимание: Платежи через Telegram Stars окончательны и не подлежат возврату согласно политике Telegram. PeerPack выступает гарантом честности сделки, но не может вернуть Stars - только перенаправить их правильному получателю.
                </div>
            </div>

            <button 
                style={styles.confirmButton}
                onClick={() => {
                    onPaymentConfirm();
                    alert('Платеж заблокирован! Свяжитесь с курьером для передачи посылки.');
                }}
            >
                Подтвердить и заблокировать ₽{packageData.reward}
            </button>
        </div>
    );
};

export default CourierContactScreen;