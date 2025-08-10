import React from 'react';
import { renderStars } from '../utils/courierUtils';

const CourierCard = ({ 
    courier, 
    index, 
    onClick, 
    getRequestStatus, 
    getStatusStyle, 
    getStatusText,
    getTimeUntilDeparture 
}) => {
    const styles = {
        newCard: {
            background: 'linear-gradient(135deg, #2b2b2b 0%, #2a2a2a 100%)',
            border: '1px solid #3a3a3a',
            borderRadius: 16,
            padding: 0,
            marginBottom: 16,
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            opacity: 1,
            animation: 'slideIn 0.5s ease-out'
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px 12px',
            borderBottom: '1px solid rgba(58, 58, 58, 0.5)'
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
            color: 'white'
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
            color: '#ddd'
        },
        priceTag: {
            background: '#00bfa6',
            color: 'black',
            padding: '6px 12px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600
        },
        routeSection: {
            padding: '12px 20px 8px'
        },
        routeInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
        },
        cities: {
            fontSize: 16,
            fontWeight: 600,
            color: 'white'
        },
        timeInfo: {
            display: 'flex',
            alignItems: 'center'
        },
        timeHighlight: {
            background: 'rgba(0, 191, 166, 0.1)',
            color: '#00bfa6',
            padding: '4px 8px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600
        },
        countdown: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        countdownText: {
            fontSize: 12,
            color: '#aaa',
            fontWeight: 500
        },
        commentSection: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '8px 20px 12px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid rgba(58, 58, 58, 0.3)'
        },
        commentIcon: {
            fontSize: 16,
            opacity: 0.7
        },
        commentText: {
            fontSize: 13,
            color: '#bbb',
            lineHeight: 1.4,
            flex: 1
        },
        cardFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px 16px'
        },
        statsInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: 4
        },
        tripsCount: {
            fontSize: 12,
            color: '#999',
            fontWeight: 500
        },
        reviewsCount: {
            fontSize: 12,
            color: '#999',
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
                    <div style={styles.cities}>{courier.from} → {courier.to}</div>
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
                <div style={styles.commentText}>{courier.tripComment}</div>
            </div>
            
            <div style={styles.cardFooter}>
                <div style={styles.statsInfo}>
                    <span style={styles.tripsCount}>{courier.tripsCount} поездок</span>
                    <span style={styles.reviewsCount}>• {courier.reviewsCount} отзывов</span>
                </div>
                {getRequestStatus(courier) && (
                    <span style={getStatusStyle(getRequestStatus(courier))}>
                        {getStatusText(getRequestStatus(courier))}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CourierCard;