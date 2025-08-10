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
            padding: 16,
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            animation: 'slideIn 0.6s ease-out',
            marginBottom: 16
        },
        label: {
            display: 'block',
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--tg-theme-hint-color, #708499)'
        },
        inputWithClear: {
            position: 'relative',
            marginBottom: 16
        },
        inputWithButton: {
            width: '100%',
            padding: '12px 16px',
            fontSize: 16,
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            outline: 'none',
            backgroundColor: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-text-color, #ffffff)',
            transition: 'all 0.2s ease',
            paddingRight: '45px',
            boxSizing: 'border-box'
        },
        clearButton: {
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--tg-theme-hint-color, #708499)',
            border: 'none',
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 12,
            color: 'var(--tg-theme-bg-color, #17212b)',
            transition: 'all 0.2s ease'
        },
        searchButton: {
            width: '100%',
            padding: '12px 16px',
            marginTop: 16,
            fontSize: 16,
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
            transition: 'all 0.2s ease'
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
            
            <label style={styles.label}>Куда доставить</label>
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
                        padding: '10px 12px',
                        borderRadius: 6,
                        border: 'none',
                        background: 'var(--tg-theme-bg-color, #17212b)',
                        color: 'var(--tg-theme-text-color, #ffffff)',
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span style={{ fontSize: 16, opacity: 0.7 }}>📅</span>
                        <span>{getDateRangeLabel()}</span>
                    </div>
                    <span style={{ 
                        fontSize: 10, 
                        color: 'var(--tg-theme-hint-color, #708499)',
                        transform: showDatePicker ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
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
                        gap: 6,
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
                                    padding: '8px 8px',
                                    borderRadius: 6,
                                    border: 'none',
                                    background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                                    color: 'var(--tg-theme-text-color, #ffffff)',
                                    cursor: 'pointer',
                                    fontSize: 11,
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    opacity: 0.9
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
                                    padding: '8px 6px',
                                    borderRadius: 6,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: 12,
                                    background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                                    color: 'var(--tg-theme-text-color, #ffffff)',
                                    boxSizing: 'border-box'
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
                                    padding: '8px 6px',
                                    borderRadius: 6,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: 12,
                                    background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                                    color: 'var(--tg-theme-text-color, #ffffff)',
                                    boxSizing: 'border-box'
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