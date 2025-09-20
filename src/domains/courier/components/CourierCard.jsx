import React from 'react';
import { renderStars } from '../../../utils/courierUtils';

const CourierCard = ({ 
    courier, 
    index, 
    onClick, 
    getRequestStatus, 
    getStatusStyle, 
    getStatusText,
    getTimeUntilDeparture 
}) => {
    const requestStatus = getRequestStatus(courier);
    const isPending = requestStatus === 'pending';
    const styles = {
        newCard: {
            background: isPending 
                ? 'rgba(255, 215, 0, 0.1)' 
                : 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: isPending 
                ? '0.5px solid rgba(255, 215, 0, 0.4)' 
                : '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 12,
            padding: 0,
            marginBottom: 8,
            overflow: 'hidden',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            opacity: isPending ? 0.85 : 1,
            animation: 'slideIn 0.5s ease-out'
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px 10px',
            borderBottom: '0.5px solid var(--tg-theme-hint-color, #708499)'
        },
        courierInfo1: {
            display: 'flex',
            alignItems: 'center',
            gap: 12
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: '50%',
            objectFit: 'cover'
        },
        courierDetails: {
            display: 'flex',
            flexDirection: 'column'
        },
        courierName: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        rating: {
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 2
        },
        stars: {
            color: '#ffd700',
            fontSize: 14
        },
        ratingText: {
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #708499)'
        },
        priceTag: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            padding: '4px 8px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600
        },
        routeSection: {
            padding: '10px 16px 8px'
        },
        routeInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
        },
        cities: {
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        cityFrom: {
            fontWeight: 600
        },
        routeArrow: {
            color: 'var(--tg-theme-button-color, #5288c1)',
            fontSize: '16px',
            fontWeight: '700',
            margin: '0 2px'
        },
        cityTo: {
            fontWeight: 600
        },
        timeInfo: {
            display: 'flex',
            alignItems: 'center'
        },
        timeHighlight: {
            background: 'rgba(100, 181, 239, 0.15)',
            color: 'var(--tg-theme-accent-text-color, #64b5ef)',
            padding: '3px 6px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500
        },
        countdown: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        countdownText: {
            fontSize: 12,
            color: 'var(--tg-theme-hint-color, #708499)',
            fontWeight: 500
        },
        commentSection: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '8px 16px 10px',
            background: 'rgba(100, 181, 239, 0.05)',
            borderTop: '0.5px solid var(--tg-theme-hint-color, #708499)'
        },
        commentIcon: {
            fontSize: 16,
            opacity: 0.7
        },
        commentText: {
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #708499)',
            lineHeight: 1.4,
            flex: 1
        },
        cardFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px 12px'
        },
        statsInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: 4
        },
        tripsCount: {
            fontSize: 12,
            color: 'var(--tg-theme-hint-color, #708499)',
            fontWeight: 500
        },
        reviewsCount: {
            fontSize: 12,
            color: 'var(--tg-theme-hint-color, #708499)',
            fontWeight: 500
        }
    };

    return (
        <div 
            className="card-hover"
            style={{
                ...styles.newCard,
                animationDelay: `${index * 0.1}s`
            }}
            onClick={() => onClick(courier)}
        >
            <div style={styles.cardHeader}>
                <div style={styles.courierInfo1}>
                    <img src={courier.avatar} alt={courier.name} style={styles.avatar} />
                    <div style={styles.courierDetails}>
                        <div style={styles.courierName}>{courier.name}</div>
                        <div style={styles.rating}>
                            <span style={styles.stars}>{renderStars(courier.rating)}</span>
                            <span style={styles.ratingText}>{courier.rating}</span>
                        </div>
                    </div>
                </div>
                <div style={styles.priceTag}>₽{courier.price}</div>
            </div>
            
            <div style={styles.routeSection}>
                <div style={styles.routeInfo}>
                    <div style={styles.cities}>
                        <span style={styles.cityFrom}>{courier.from}</span>
                        <span style={styles.routeArrow}>→</span>
                        <span style={styles.cityTo}>{courier.to}</span>
                    </div>
                    <div style={styles.timeInfo}>
                        <span style={styles.timeHighlight}>🕐 {courier.time}</span>
                    </div>
                </div>
                <div style={styles.countdown}>
                    <span style={styles.countdownText}>⏰ {getTimeUntilDeparture(courier.date, courier.time)}</span>
                </div>
            </div>
            
            <div style={styles.commentSection}>
                <div style={styles.commentIcon}>💬</div>
                <div style={styles.commentText}>{courier.trip_comment || 'Комментарий отсутствует'}</div>
            </div>
            
            <div style={styles.cardFooter}>
                <div style={styles.statsInfo}>
                    <span style={styles.tripsCount}>{courier.trips_count || 0} поездок</span>
                    <span style={styles.reviewsCount}>• {courier.reviews_count || 0} отзывов</span>
                </div>
                {requestStatus && (
                    <span style={getStatusStyle(requestStatus)}>
                        {getStatusText(requestStatus)}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CourierCard;