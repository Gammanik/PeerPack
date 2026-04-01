import React from 'react';

const UserRating = ({ rating, reviewsCount, size = 'medium', showReviewsCount = true }) => {
  const styles = {
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: size === 'small' ? '4px' : '6px'
    },
    star: {
      color: '#FFD700',
      fontSize: size === 'small' ? '12px' : size === 'large' ? '18px' : '14px',
      lineHeight: '1'
    },
    rating: {
      fontSize: size === 'small' ? '13px' : size === 'large' ? '17px' : '15px',
      fontWeight: '600',
      color: 'var(--tg-theme-text-color, #ffffff)',
      lineHeight: '1'
    },
    reviewsCount: {
      fontSize: size === 'small' ? '12px' : size === 'large' ? '15px' : '13px',
      color: 'var(--tg-theme-hint-color, #708499)',
      lineHeight: '1'
    }
  };

  // Если нет рейтинга, показываем "Нет отзывов"
  if (!rating || reviewsCount === 0) {
    return (
      <div style={styles.container}>
        <span style={{...styles.reviewsCount, fontStyle: 'italic'}}>
          Нет отзывов
        </span>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <span style={styles.star}>⭐</span>
      <span style={styles.rating}>{rating.toFixed(1)}</span>
      {showReviewsCount && reviewsCount > 0 && (
        <span style={styles.reviewsCount}>
          ({reviewsCount} {reviewsCount === 1 ? 'отзыв' : reviewsCount < 5 ? 'отзыва' : 'отзывов'})
        </span>
      )}
    </div>
  );
};

export default UserRating;
