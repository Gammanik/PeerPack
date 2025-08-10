import React from 'react';

const SearchForm = ({
    from,
    setFrom,
    to,
    setTo,
    selectedDate,
    setSelectedDate,
    showDatePicker,
    setShowDatePicker,
    availableCities,
    handleSearch,
    clearFromCity,
    clearToCity,
    getDatePresets,
    formatDate
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
                marginTop: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}>
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        aria-expanded={showDatePicker}
                        aria-controls="date-optional-panel"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '10px 14px',
                            borderRadius: 9999,
                            border: '1px solid rgba(0,191,166,0.35)',
                            background: 'linear-gradient(180deg, rgba(0,191,166,0.06), rgba(0,191,166,0.03))',
                            color: '#0f766e',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'transform .15s ease, box-shadow .15s ease, background .2s ease',
                            boxShadow: showDatePicker ? '0 4px 16px rgba(0,191,166,0.15)' : 'none'
                        }}
                        className="button-hover"
                    >
                        <span style={{
                            width: 24, height: 24, display: 'inline-flex',
                            alignItems: 'center', justifyContent: 'center',
                            background: '#00bfa6', color: 'white', borderRadius: 6,
                            fontSize: 14, boxShadow: '0 2px 8px rgba(0,191,166,0.35)'
                        }}>📅</span>
                        <span>Дата</span>
                        <span style={{ opacity: 0.6 }}>{showDatePicker ? '▲' : '▼'}</span>
                    </button>

                    {selectedDate && (
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            borderRadius: 9999,
                            background: 'rgba(0,191,166,0.08)',
                            border: '1px solid rgba(0,191,166,0.25)',
                            color: '#0f766e',
                            fontWeight: 500
                        }}>
                            {formatDate(selectedDate)}
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedDate(''); }}
                                title="Сбросить дату"
                                style={{
                                    width: 22, height: 22, borderRadius: 11,
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    background: 'white',
                                    color: '#666',
                                    cursor: 'pointer',
                                    lineHeight: 1
                                }}
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>

                {showDatePicker && (
                    <div
                        id="date-optional-panel"
                        style={{
                            border: '1px solid rgba(0,0,0,0.08)',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))',
                            borderRadius: 14,
                            padding: 14,
                            boxShadow: '0 8px 28px rgba(0,0,0,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                        }}
                        className="modal-enter"
                    >
                        <div style={{ fontSize: 12, color: '#667085' }}>
                            Выберите готовый пресет или укажите точную дату
                        </div>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 8
                        }}>
                            {getDatePresets().map((preset, index) => {
                                const active = selectedDate === preset.value;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedDate(preset.value);
                                            if (window.innerWidth <= 768) setShowDatePicker(false);
                                        }}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: 9999,
                                            border: `1px solid ${active ? 'rgba(0,191,166,0.6)' : 'rgba(0,0,0,0.1)'}`,
                                            background: active ? 'rgba(0,191,166,0.1)' : 'white',
                                            color: active ? '#0f766e' : '#555',
                                            cursor: 'pointer',
                                            fontWeight: 600
                                        }}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                        }}>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    if (window.innerWidth <= 768) setShowDatePicker(false);
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                style={{
                                    flex: '0 1 220px',
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: '1px solid rgba(0,0,0,0.12)',
                                    outline: 'none',
                                    fontSize: 14,
                                    color: '#222',
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
                                }}
                                className="search-input"
                            />

                            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                                <button
                                    onClick={() => setSelectedDate('')}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: 10,
                                        border: '1px dashed rgba(0,0,0,0.2)',
                                        background: 'transparent',
                                        color: '#666',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Сбросить
                                </button>
                                <button
                                    onClick={() => setShowDatePicker(false)}
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: 10,
                                        border: 'none',
                                        background: '#00bfa6',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        boxShadow: '0 6px 18px rgba(0,191,166,0.35)'
                                    }}
                                    className="button-hover"
                                >
                                    Готово
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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