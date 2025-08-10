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
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modal: {
            backgroundColor: '#2b2b2b',
            borderRadius: 16,
            padding: 0,
            maxWidth: 500,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 20px 10px',
            borderBottom: '1px solid #3a3a3a',
            color: 'white'
        },
        closeButton: {
            background: 'transparent',
            border: 'none',
            color: '#aaa',
            fontSize: 20,
            cursor: 'pointer'
        },
        modalContent: {
            padding: 20,
            maxHeight: 'calc(80vh - 70px)',
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
            color: '#aaa'
        },
        trips: {
            color: '#aaa',
            fontSize: 14,
            margin: 0
        },
        tripInfo: {
            marginBottom: 20,
            padding: 15,
            backgroundColor: '#1c1c1c',
            borderRadius: 8,
            color: 'white'
        },
        pastTripsSection: {
            marginBottom: 20
        },
        pastTrip: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #3a3a3a',
            color: 'white'
        },
        tripDate: {
            fontSize: 12,
            color: '#aaa'
        },
        tripStatus: {
            color: '#00bfa6',
            fontSize: 14
        },
        reviewsSection: {
            marginBottom: 20
        },
        review: {
            padding: '10px 0',
            borderBottom: '1px solid #3a3a3a'
        },
        reviewHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5
        },
        reviewDate: {
            fontSize: 11,
            color: '#aaa'
        },
        reviewText: {
            fontSize: 14,
            color: '#ddd',
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
            backgroundColor: '#00bfa6',
            color: 'black',
            border: 'none',
            borderRadius: 10,
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer'
        },
        sectionTitle: {
            color: 'white',
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
                        {selectedCourier.pastTrips.map((trip, index) => (
                            <div key={index} style={styles.pastTrip}>
                                <span>{trip.from} → {trip.to}</span>
                                <span style={styles.tripDate}>{trip.date}</span>
                                <span style={styles.tripStatus}>✓</span>
                            </div>
                        ))}
                    </div>

                    <div style={styles.reviewsSection}>
                        <h4 style={styles.sectionTitle}>Отзывы</h4>
                        {selectedCourier.reviews.map((review, index) => (
                            <div key={index} style={styles.review}>
                                <div style={styles.reviewHeader}>
                                    <span style={styles.stars}>{renderStars(review.rating)}</span>
                                    <span style={styles.reviewDate}>{review.date}</span>
                                </div>
                                <p style={styles.reviewText}>{review.text}</p>
                            </div>
                        ))}
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