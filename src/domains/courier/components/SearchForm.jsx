import React from 'react';

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
    availableCities,
    handleSearch,
    clearFromCity,
    clearToCity,
    getDatePresets,
    getDateRangeLabel
}) => {
    const styles = {
        searchContainer: {
            position: 'relative',
            maxWidth: 480,
            margin: '0 auto',
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            borderRadius: 12,
            padding: '12px',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            animation: 'slideIn 0.6s ease-out',
            marginBottom: 16,
            '@media (min-width: 768px)': {
                padding: 16
            }
        },
        label: {
            display: 'block',
            marginBottom: 6,
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--tg-theme-hint-color, #708499)',
            '@media (min-width: 768px)': {
                fontSize: 14
            }
        },
        inputWithClear: {
            position: 'relative',
            marginBottom: 14
        },
        inputWithButton: {
            width: '100%',
            padding: '10px 12px',
            fontSize: '15px',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            outline: 'none',
            backgroundColor: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-text-color, #ffffff)',
            transition: 'all 0.2s ease',
            paddingRight: '40px',
            boxSizing: 'border-box',
            minHeight: '44px',
            '@media (min-width: 768px)': {
                padding: '12px 16px',
                fontSize: 16,
                paddingRight: '45px'
            }
        },
        clearButton: {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--tg-theme-hint-color, #708499)',
            border: 'none',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 14,
            color: 'var(--tg-theme-bg-color, #17212b)',
            transition: 'all 0.2s ease',
            '@media (min-width: 768px)': {
                right: 10,
                width: 20,
                height: 20,
                fontSize: 12
            }
        },
        searchButton: {
            width: '100%',
            padding: '14px 16px',
            marginTop: 16,
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            backgroundColor: 'var(--tg-theme-button-color, #5288c1)',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
            minHeight: '48px',
            '@media (min-width: 768px)': {
                padding: '12px 16px',
                fontSize: 16,
                minHeight: 'auto'
            }
        },
        searchButtonIcon: {
            fontSize: 20
        }
    };

    return (
        <div className="search-container" style={styles.searchContainer}>
            <label style={styles.label}>Откуда отправить</label>
            <div style={styles.inputWithClear}>
                <input
                    className="search-input"
                    list="available-cities"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Например, Москва"
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
            
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6
            }}>
                <label style={styles.label}>Куда доставить</label>
                <button
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--tg-theme-hint-color, #708499)',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease',
                        opacity: 0.6,
                        padding: '4px 6px',
                        lineHeight: 1,
                        minWidth: '28px',
                        minHeight: '28px',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => {
                        const tempFrom = from;
                        setFrom(to);
                        setTo(tempFrom);
                    }}
                    title="Поменять города местами"
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '0.6'}
                >
                    ⇅
                </button>
            </div>
            <div style={styles.inputWithClear}>
                <input
                    className="search-input"
                    list="available-cities"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Например, Сочи"
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
            
            <datalist id="available-cities">
                {availableCities.map(city => (
                    <option key={city} value={city} />
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
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 8,
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
                                    padding: '10px 6px',
                                    borderRadius: 6,
                                    border: 'none',
                                    background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                                    color: 'var(--tg-theme-text-color, #ffffff)',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    opacity: 0.9,
                                    minHeight: '36px',
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
                            }}>С</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                style={{
                                    width: '100%',
                                    padding: '10px 8px',
                                    borderRadius: 6,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '13px',
                                    background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                                    color: 'var(--tg-theme-text-color, #ffffff)',
                                    boxSizing: 'border-box',
                                    minHeight: '40px'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                fontSize: 11,
                                color: 'var(--tg-theme-hint-color, #708499)',
                                marginBottom: 4,
                                display: 'block'
                            }}>До</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                min={dateFrom || new Date().toISOString().split('T')[0]}
                                style={{
                                    width: '100%',
                                    padding: '10px 8px',
                                    borderRadius: 6,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '13px',
                                    background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                                    color: 'var(--tg-theme-text-color, #ffffff)',
                                    boxSizing: 'border-box',
                                    minHeight: '40px'
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
                Передать посылку
            </button>
        </div>
    );
};

export default SearchForm;