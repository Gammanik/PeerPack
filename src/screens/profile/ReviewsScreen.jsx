import React, { useState, useEffect } from 'react';
import { supabaseApi } from '../../services/supabaseApi.js';
import UserRating from '../../components/UserRating.jsx';

const ReviewsScreen = ({ userId, userName, userAvatar, userRating, reviewsCount, onBack }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadReviews();
    }
  }, [userId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { reviews: fetchedReviews } = await supabaseApi.getReviewsForUser(userId);

      // Если отзывов нет и reviewsCount > 0, создаем демо-отзывы
      if ((!fetchedReviews || fetchedReviews.length === 0) && reviewsCount > 0) {
        console.log('Creating demo reviews for user...');
        await supabaseApi.createDemoReviews(userId);
        // Перезагружаем отзывы после создания
        const { reviews: newReviews } = await supabaseApi.getReviewsForUser(userId);
        setReviews(newReviews || []);
      } else {
        setReviews(fetchedReviews || []);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      background: 'linear-gradient(135deg, var(--tg-theme-bg-color, #17212b) 0%, rgba(23, 33, 43, 0.95) 100%)',
      minHeight: '100vh',
      paddingBottom: '80px'
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      background: 'var(--tg-theme-bg-color, #17212b)',
      zIndex: 10,
      backdropFilter: 'blur(20px)'
    },
    backButton: {
      background: 'transparent',
      border: 'none',
      color: 'var(--tg-theme-link-color, #64b5ef)',
      fontSize: '16px',
      cursor: 'pointer',
      fontWeight: '500',
      padding: '8px 0',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '8px'
    },
    content: {
      padding: '20px'
    },
    userCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center'
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid var(--tg-theme-button-color, #5288c1)',
      boxShadow: '0 12px 32px rgba(82, 136, 193, 0.4)',
      marginBottom: '16px'
    },
    userName: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '12px'
    },
    ratingContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px'
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      paddingTop: '16px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    statItem: {
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'var(--tg-theme-accent-text-color, #64b5ef)',
      display: 'block'
    },
    statLabel: {
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)',
      marginTop: '4px'
    },
    sectionHeader: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    reviewCard: {
      background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    reviewerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    reviewerAvatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    reviewerName: {
      fontSize: '15px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      marginBottom: '4px'
    },
    reviewDate: {
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    stars: {
      display: 'flex',
      gap: '2px',
      fontSize: '16px'
    },
    reviewText: {
      fontSize: '14px',
      color: 'var(--tg-theme-text-color, #ffffff)',
      lineHeight: '1.5',
      marginBottom: '8px'
    },
    deliveryInfo: {
      fontSize: '12px',
      color: 'var(--tg-theme-hint-color, #708499)',
      background: 'rgba(100, 181, 239, 0.1)',
      padding: '8px 10px',
      borderRadius: '8px',
      marginTop: '8px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--tg-theme-hint-color, #708499)'
    },
    loadingState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--tg-theme-hint-color, #708499)'
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#FFD700' : '#555' }}>
          ⭐
        </span>
      );
    }
    return <div style={styles.stars}>{stars}</div>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Назад
        </button>
        <div style={styles.title}>Профиль и отзывы</div>
      </div>

      <div style={styles.content}>
        {/* Карточка пользователя */}
        <div style={styles.userCard}>
          <img
            src={userAvatar || 'https://i.pravatar.cc/100?img=50'}
            alt={userName}
            style={styles.avatar}
          />
          <div style={styles.userName}>{userName}</div>
          <div style={styles.ratingContainer}>
            <UserRating
              rating={userRating}
              reviewsCount={reviewsCount}
              size="large"
            />
          </div>
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{reviewsCount || 0}</span>
              <div style={styles.statLabel}>ОТЗЫВОВ</div>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{userRating ? userRating.toFixed(1) : '—'}</span>
              <div style={styles.statLabel}>РЕЙТИНГ</div>
            </div>
          </div>
        </div>

        {/* Список отзывов */}
        {loading ? (
          <div style={styles.loadingState}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            <div>Загрузка отзывов...</div>
          </div>
        ) : reviews.length > 0 ? (
          <>
            <h3 style={styles.sectionHeader}>
              <span>⭐</span>
              <span>Отзывы ({reviews.length})</span>
            </h3>

            {reviews.map((review) => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewerInfo}>
                    <img
                      src={review.reviewer?.avatar_url || 'https://i.pravatar.cc/100'}
                      alt={review.reviewer?.full_name || 'Пользователь'}
                      style={styles.reviewerAvatar}
                    />
                    <div>
                      <div style={styles.reviewerName}>
                        {review.reviewer?.full_name || 'Пользователь'}
                      </div>
                      <div style={styles.reviewDate}>
                        {new Date(review.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {review.comment && (
                  <div style={styles.reviewText}>{review.comment}</div>
                )}

                <div style={styles.deliveryInfo}>
                  📦 Доставка #{review.delivery_id}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Пока нет отзывов
            </div>
            <div style={{ fontSize: '14px' }}>
              Отзывы появятся после завершения доставок
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsScreen;