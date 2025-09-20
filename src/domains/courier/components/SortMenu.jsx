import React from 'react';
import { sortCouriers } from '../../../utils/courierUtils';

const SortMenu = ({ 
    results, 
    setResults, 
    sortBy, 
    setSortBy, 
    showSortMenu, 
    setShowSortMenu 
}) => {
    const styles = {
        compactSortSection: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 16,
            position: 'relative'
        },
        sortToggle: {
            background: 'none',
            border: 'none',
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 13,
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'color 0.2s ease'
        },
        sortDropdown: {
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            padding: 6,
            zIndex: 1000,
            display: 'flex',
            gap: 4,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(20px)',
            marginTop: 4
        },
        compactSortButton: {
            background: 'none',
            border: 'none',
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 12,
            padding: '6px 10px',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
        },
        compactSortButtonActive: {
            background: 'rgba(100, 181, 239, 0.15)',
            color: 'var(--tg-theme-accent-text-color, #64b5ef)'
        }
    };

    const handleSort = (sortType) => {
        setSortBy(sortType);
        const sorted = sortCouriers(results, sortType);
        setResults(sorted);
        setShowSortMenu(false);
    };

    if (results.length <= 1) return null;

    return (
        <div className="compact-sort-section" style={styles.compactSortSection}>
            <button 
                className="sort-toggle"
                style={styles.sortToggle}
                onClick={() => setShowSortMenu(!showSortMenu)}
            >
                сортировка ▼
            </button>
            {showSortMenu && (
                <div style={styles.sortDropdown}>
                    <button 
                        className="compact-sort-button"
                        style={{
                            ...styles.compactSortButton,
                            ...(sortBy === 'time' ? styles.compactSortButtonActive : {})
                        }}
                        onClick={() => handleSort('time')}
                    >
                        по времени
                    </button>
                    <button 
                        className="compact-sort-button"
                        style={{
                            ...styles.compactSortButton,
                            ...(sortBy === 'price' ? styles.compactSortButtonActive : {})
                        }}
                        onClick={() => handleSort('price')}
                    >
                        по цене
                    </button>
                    <button 
                        className="compact-sort-button"
                        style={{
                            ...styles.compactSortButton,
                            ...(sortBy === 'rating' ? styles.compactSortButtonActive : {})
                        }}
                        onClick={() => handleSort('rating')}
                    >
                        по рейтингу
                    </button>
                </div>
            )}
        </div>
    );
};

export default SortMenu;