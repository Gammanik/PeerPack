import React from 'react';
import { renderStars } from '../utils/courierUtils';

const CourierModal = ({
    selectedCourier,
    showModal,
    setShowModal,
    getRequestStatus,
    getStatusStyle,
    getStatusText,
    sentRequests,
    isRequestSent,
    setShowRequestForm
}) => {
    const styles = {
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '16px'
        },
        modal: {
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            borderRadius: 12,
            padding: 0,
            maxWidth: 480,
            width: '100%',
            maxHeight: '85vh',
            overflow: 'hidden',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 16px 12px',
            borderBottom: '0.5px solid var(--tg-theme-hint-color, #708499)',
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        closeButton: {
            background: 'transparent',
            border: 'none',
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 18,
            cursor: 'pointer',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16
        },
        modalContent: {
            padding: 16,
            maxHeight: 'calc(85vh - 60px)',
            overflowY: 'auto'
        },
        courierInfo: {
            display: 'flex',
            gap: 15,
            marginBottom: 20,
            alignItems: 'center'
        },
        modalAvatar: {
            width: 60,
            height: 60,
            borderRadius: '50%',
            objectFit: 'cover'
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
            color: 'var(--tg-theme-hint-color, #708499)'
        },
        trips: {
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 14,
            margin: 0
        },
        tripInfo: {
            marginBottom: 16,
            padding: 12,
            backgroundColor: 'var(--tg-theme-bg-color, #17212b)',
            borderRadius: 8,
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        pastTripsSection: {
            marginBottom: 20
        },
        pastTrip: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '0.5px solid var(--tg-theme-hint-color, #708499)',
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        tripDate: {
            fontSize: 12,
            color: 'var(--tg-theme-hint-color, #708499)'
        },
        tripStatus: {
            color: 'var(--tg-theme-accent-text-color, #64b5ef)',
            fontSize: 14
        },
        reviewsSection: {
            marginBottom: 20
        },
        review: {
            padding: '10px 0',
            borderBottom: '0.5px solid var(--tg-theme-hint-color, #708499)'
        },
        reviewHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5
        },
        reviewDate: {
            fontSize: 11,
            color: 'var(--tg-theme-hint-color, #708499)'
        },
        reviewText: {
            fontSize: 14,
            color: 'var(--tg-theme-text-color, #ffffff)',
            margin: 0
        },
        requestStatusSection: {
            marginTop: 20,
            padding: 15,
            background: '#1c1c1c',
            borderRadius: 8,
            border: '1px solid #3a3a3a'
        },
        courierCommentBox: {
            marginTop: 10,
            padding: 10,
            background: 'rgba(0,191,166,0.05)',
            borderRadius: 6,
            border: '1px solid rgba(0,191,166,0.2)',
            color: 'white'
        },
        courierComment: {
            margin: '5px 0 0 0',
            color: '#ddd',
            fontSize: 14
        },
        requestButton: {
            width: '100%',
            padding: 12,
            backgroundColor: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
        },
        sectionTitle: {
            color: 'var(--tg-theme-text-color, #ffffff)',
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 10
        }
    };

    if (!showModal || !selectedCourier) return null;

    return (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className="modal-enter" style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h3>{selectedCourier.name}</h3>
                    <button 
                        style={styles.closeButton}
                        onClick={() => setShowModal(false)}
                    >
                        ✕
                    </button>
                </div>
                
                <div style={styles.modalContent}>
                    <div style={styles.courierInfo}>
                        <img src={selectedCourier.avatar} alt={selectedCourier.name} style={styles.modalAvatar} />
                        <div>
                            <div style={styles.rating}>
                                <span style={styles.stars}>{renderStars(selectedCourier.rating)}</span>
                                <span style={styles.ratingText}>{selectedCourier.rating} ({selectedCourier.reviewsCount} отзывов)</span>
                            </div>
                            <p style={styles.trips}>{selectedCourier.tripsCount} успешных поездок</p>
                        </div>
                    </div>

                    <div style={styles.tripInfo}>
                        <h4 style={styles.sectionTitle}>Предстоящая поездка</h4>
                        <p><strong>{selectedCourier.from} → {selectedCourier.to}</strong></p>
                        <p>{selectedCourier.date}, {selectedCourier.time}</p>
                        <p>Аэропорт: {selectedCourier.airport}</p>
                    </div>

                    <div style={styles.pastTripsSection}>
                        <h4 style={styles.sectionTitle}>Последние поездки</h4>
                        {selectedCourier.pastTrips && selectedCourier.pastTrips.length > 0 ? (
                            selectedCourier.pastTrips.map((trip, index) => (
                                <div key={index} style={styles.pastTrip}>
                                    <span>{trip.from} → {trip.to}</span>
                                    <span style={styles.tripDate}>{trip.date}</span>
                                    <span style={styles.tripStatus}>✓</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: 'var(--tg-theme-hint-color, #708499)', fontSize: 14 }}>
                                Нет данных о предыдущих поездках
                            </div>
                        )}
                    </div>

                    <div style={styles.reviewsSection}>
                        <h4 style={styles.sectionTitle}>Отзывы</h4>
                        {selectedCourier.reviews && selectedCourier.reviews.length > 0 ? (
                            selectedCourier.reviews.map((review, index) => (
                                <div key={index} style={styles.review}>
                                    <div style={styles.reviewHeader}>
                                        <span style={styles.stars}>{renderStars(review.rating)}</span>
                                        <span style={styles.reviewDate}>{review.date}</span>
                                    </div>
                                    <p style={styles.reviewText}>{review.text}</p>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: 'var(--tg-theme-hint-color, #708499)', fontSize: 14 }}>
                                Пока нет отзывов
                            </div>
                        )}
                    </div>

                    {/* Показать статус и комментарий заявки, если есть */}
                    {getRequestStatus(selectedCourier) && (
                        <div style={styles.requestStatusSection}>
                            <h4 style={styles.sectionTitle}>Статус вашей заявки</h4>
                            <div style={{
                                ...getStatusStyle(getRequestStatus(selectedCourier))
                            }}>
                                {getStatusText(getRequestStatus(selectedCourier))}
                            </div>
                            {sentRequests.find(req => req.courierId === selectedCourier.name + selectedCourier.date)?.courierComment && (
                                <div style={styles.courierCommentBox}>
                                    <strong>Комментарий от {selectedCourier.name}:</strong>
                                    <p style={styles.courierComment}>
                                        {sentRequests.find(req => req.courierId === selectedCourier.name + selectedCourier.date)?.courierComment}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {!isRequestSent(selectedCourier) && (
                        <button 
                            className="button-hover"
                            style={styles.requestButton}
                            onClick={() => setShowRequestForm(true)}
                        >
                            Отправить заявку на доставку
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourierModal;