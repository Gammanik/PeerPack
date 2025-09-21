import React, { useState, useEffect } from 'react';
import { useLocale } from '../../../contexts/LanguageContext.jsx';

const SearchForm = ({
    from,
    setFrom,
    to,
    setTo,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    showDatePicker,
    setShowDatePicker,
    handleSearch,
    clearFromCity,
    clearToCity,
    getDatePresets,
    getDateRangeLabel
}) => {
    const { t, getCities } = useLocale();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isVeryNarrow = screenWidth < 400;
    const isMobile = screenWidth < 480;
    const isTablet = screenWidth >= 480 && screenWidth < 768;
    const isDesktop = screenWidth >= 768;

    const styles = {
        searchContainer: {
            position: 'relative',
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            borderRadius: isMobile ? 8 : 12,
            padding: isVeryNarrow ? '8px' : isMobile ? '10px' : isTablet ? '16px' : '20px',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            animation: 'slideIn 0.6s ease-out',
            marginBottom: 16,
            boxSizing: 'border-box'
        },
        label: {
            display: 'block',
            marginBottom: 6,
            fontSize: isMobile ? '12px' : isDesktop ? '14px' : '13px',
            fontWeight: 500,
            color: 'var(--tg-theme-hint-color, #708499)'
        },
        inputWithClear: {
            position: 'relative',
            marginBottom: 0
        },
        inputWithButton: {
            width: '100%',
            padding: isVeryNarrow ? '8px 4px' : isMobile ? '10px 6px' : isTablet ? '12px 8px' : '14px 12px',
            fontSize: isVeryNarrow ? '13px' : isMobile ? '14px' : isTablet ? '15px' : '16px',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: isVeryNarrow ? 4 : isMobile ? 6 : 8,
            outline: 'none',
            backgroundColor: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-text-color, #ffffff)',
            transition: 'all 0.2s ease',
            paddingRight: isVeryNarrow ? '26px' : isMobile ? '30px' : isTablet ? '36px' : '42px',
            boxSizing: 'border-box',
            minHeight: isVeryNarrow ? '36px' : isMobile ? '40px' : isTablet ? '44px' : '48px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
        },
        clearButton: {
            position: 'absolute',
            right: isVeryNarrow ? 2 : isMobile ? 4 : isTablet ? 6 : 8,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--tg-theme-hint-color, #708499)',
            border: 'none',
            borderRadius: '50%',
            width: isVeryNarrow ? 16 : isMobile ? 18 : isTablet ? 20 : 22,
            height: isVeryNarrow ? 16 : isMobile ? 18 : isTablet ? 20 : 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: isVeryNarrow ? 10 : isMobile ? 11 : isTablet ? 12 : 13,
            color: 'var(--tg-theme-bg-color, #17212b)',
            transition: 'all 0.2s ease'
        },
        searchButton: {
            width: '100%',
            padding: isVeryNarrow ? '12px 8px' : isMobile ? '14px 12px' : isTablet ? '16px 16px' : '18px 20px',
            marginTop: isVeryNarrow ? 12 : isMobile ? 14 : isTablet ? 16 : 18,
            fontSize: isVeryNarrow ? '14px' : isMobile ? '15px' : isTablet ? '16px' : '17px',
            fontWeight: 600,
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            backgroundColor: 'var(--tg-theme-button-color, #5288c1)',
            border: 'none',
            borderRadius: isVeryNarrow ? 6 : isMobile ? 8 : 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isVeryNarrow ? 6 : isMobile ? 8 : 10,
            transition: 'all 0.2s ease',
            minHeight: isVeryNarrow ? '40px' : isMobile ? '44px' : isTablet ? '48px' : '52px',
            boxSizing: 'border-box'
        },
        searchButtonIcon: {
            fontSize: 20
        }
    };

    const cities = getCities();

    return (
        <div className="search-container" style={styles.searchContainer}>
            {/* Поля "Откуда" и "Куда" в одном ряду */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: isVeryNarrow ? '4px' : isMobile ? '6px' : '8px',
                marginBottom: 16,
                width: '100%',
                boxSizing: 'border-box'
            }}>
                {/* Поле "Откуда" */}
                <div style={{ 
                    flex: '1 1 0',
                    minWidth: 0,
                    maxWidth: `calc(50% - ${isVeryNarrow ? '16px' : isMobile ? '18px' : '20px'})`
                }}>
                    <label style={styles.label}>{t('fromLabel')}</label>
                    <div style={styles.inputWithClear}>
                        <input
                            className="search-input"
                            list="available-cities"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder={t('fromPlaceholder')}
                            style={styles.inputWithButton}
                        />
                        {from && (
                            <button 
                                style={styles.clearButton}
                                onClick={clearFromCity}
                                className="clear-button"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Кнопка обмена местами */}
                <div style={{
                    paddingBottom: isVeryNarrow ? '8px' : isMobile ? '10px' : '12px',
                    flexShrink: 0
                }}>
                    <button
                        style={{
                            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
                            color: 'var(--tg-theme-hint-color, #708499)',
                            fontSize: isVeryNarrow ? '14px' : isMobile ? '16px' : '18px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            padding: 0,
                            lineHeight: 1,
                            width: isVeryNarrow ? '24px' : isMobile ? '28px' : '32px',
                            height: isVeryNarrow ? '24px' : isMobile ? '28px' : '32px',
                            borderRadius: isVeryNarrow ? 4 : 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                        onClick={() => {
                            const tempFrom = from;
                            setFrom(to);
                            setTo(tempFrom);
                        }}
                        title={t('swapCities')}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--tg-theme-button-color, #5288c1)';
                            e.target.style.color = 'var(--tg-theme-button-text-color, #ffffff)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--tg-theme-secondary-bg-color, #232e3c)';
                            e.target.style.color = 'var(--tg-theme-hint-color, #708499)';
                        }}
                    >
                        ⇅
                    </button>
                </div>
                
                {/* Поле "Куда" */}
                <div style={{ 
                    flex: '1 1 0',
                    minWidth: 0,
                    maxWidth: `calc(50% - ${isVeryNarrow ? '16px' : isMobile ? '18px' : '20px'})`
                }}>
                    <label style={styles.label}>{t('toLabel')}</label>
                    <div style={styles.inputWithClear}>
                        <input
                            className="search-input"
                            list="available-cities"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder={t('toPlaceholder')}
                            style={styles.inputWithButton}
                        />
                        {to && (
                            <button 
                                style={styles.clearButton}
                                onClick={clearToCity}
                                className="clear-button"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <datalist id="available-cities">
                {cities.map(city => (
                    <option key={city.english} value={city.local} />
                ))}
            </datalist>

            <div style={{
                marginTop: 8,
                marginBottom: 4
            }}>
                <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: 6,
                        border: 'none',
                        background: 'var(--tg-theme-bg-color, #17212b)',
                        color: 'var(--tg-theme-text-color, #ffffff)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minHeight: '44px',
                        boxSizing: 'border-box'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flex: 1,
                        textAlign: 'left'
                    }}>
                        <span style={{ fontSize: 16, opacity: 0.7 }}>📅</span>
                        <span style={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>{getDateRangeLabel()}</span>
                    </div>
                    <span style={{ 
                        fontSize: 10, 
                        color: 'var(--tg-theme-hint-color, #708499)',
                        transform: showDatePicker ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                    }}>▼</span>
                </button>
            </div>

            {showDatePicker && (
                <div
                    style={{
                        marginTop: 4,
                        marginBottom: 8,
                        background: 'var(--tg-theme-bg-color, #17212b)',
                        borderRadius: 8,
                        padding: '12px 8px',
                        animation: 'slideIn 0.2s ease-out'
                    }}
                >
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                        gap: isMobile ? 6 : 8,
                        marginBottom: 12
                    }}>
                        {getDatePresets().map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    preset.action();
                                    setShowDatePicker(false);
                                }}
                                style={{
                                    padding: '8px 4px',
                                    borderRadius: 6,
                                    border: 'none',
                                    background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                                    color: 'var(--tg-theme-text-color, #ffffff)',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    opacity: 0.9,
                                    minHeight: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 8,
                        borderTop: '0.5px solid var(--tg-theme-hint-color, #708499)',
                        paddingTop: 12
                    }}>
                        <div>
                            <label style={{
                                fontSize: 11,
                                color: 'var(--tg-theme-hint-color, #708499)',
                                marginBottom: 4,
                                display: 'block'
                            }}>{t('dateFrom')}</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                style={{
                                    width: '100%',
                                    padding: '8px 6px',
                                    borderRadius: 6,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '12px',
                                    background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                                    color: 'var(--tg-theme-text-color, #ffffff)',
                                    boxSizing: 'border-box',
                                    minHeight: '36px'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                fontSize: 11,
                                color: 'var(--tg-theme-hint-color, #708499)',
                                marginBottom: 4,
                                display: 'block'
                            }}>{t('dateTo')}</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                min={dateFrom || new Date().toISOString().split('T')[0]}
                                style={{
                                    width: '100%',
                                    padding: '8px 6px',
                                    borderRadius: 6,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '12px',
                                    background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                                    color: 'var(--tg-theme-text-color, #ffffff)',
                                    boxSizing: 'border-box',
                                    minHeight: '36px'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <button 
                className="button-hover"
                style={styles.searchButton} 
                onClick={handleSearch}
            >
                <span style={styles.searchButtonIcon}>📦</span>
{t('searchButton')}
            </button>
        </div>
    );
};

export default SearchForm;