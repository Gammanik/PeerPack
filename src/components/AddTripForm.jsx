import React, { useState } from 'react';

const AddTripForm = ({
    showAddTripForm,
    setShowAddTripForm,
    onAddTrip,
    availableCities
}) => {
    const [tripForm, setTripForm] = useState({
        from: '',
        to: '',
        date: '',
        time: '',
        transportType: 'plane',
        transportDetails: '',
        price: 800,
        comment: '',
        capacity: 'medium'
    });

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
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            borderRadius: 12,
            padding: 0,
            maxWidth: 480,
            width: '100%',
            maxHeight: '90vh',
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
            maxHeight: 'calc(90vh - 60px)',
            overflowY: 'auto',
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        formGroup: {
            marginBottom: 16
        },
        label: {
            color: 'var(--tg-theme-hint-color, #708499)',
            marginBottom: 6,
            display: 'block',
            fontSize: 14,
            fontWeight: 500
        },
        input: {
            width: '100%',
            padding: 12,
            background: 'var(--tg-theme-bg-color, #17212b)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            color: 'var(--tg-theme-text-color, #ffffff)',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box'
        },
        textarea: {
            width: '100%',
            padding: 12,
            background: 'var(--tg-theme-bg-color, #17212b)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            color: 'var(--tg-theme-text-color, #ffffff)',
            fontSize: 14,
            minHeight: 60,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box'
        },
        transportSelector: {
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 12
        },
        transportButton: {
            padding: '8px 12px',
            background: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-hint-color, #708499)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6
        },
        transportButtonActive: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: '0.5px solid var(--tg-theme-button-color, #5288c1)'
        },
        priceSelector: {
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
        },
        priceButton: {
            padding: '6px 10px',
            background: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-hint-color, #708499)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s ease'
        },
        priceButtonActive: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: '0.5px solid var(--tg-theme-button-color, #5288c1)'
        },
        modalButtons: {
            display: 'flex',
            gap: 10,
            marginTop: 20
        },
        cancelButton: {
            flex: 1,
            padding: 12,
            background: 'transparent',
            color: 'var(--tg-theme-hint-color, #708499)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14
        },
        addButton: {
            flex: 1,
            padding: 12,
            backgroundColor: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14
        }
    };

    if (!showAddTripForm) return null;

    const transportTypes = [
        {key: 'plane', label: '✈️ Самолет', icon: '✈️'},
        {key: 'train', label: '🚄 Поезд', icon: '🚄'}, 
        {key: 'car', label: '🚗 Машина', icon: '🚗'},
        {key: 'bus', label: '🚌 Автобус', icon: '🚌'}
    ];

    const capacityTypes = [
        {key: 'small', label: 'Только документы'},
        {key: 'medium', label: 'До 5кг'},
        {key: 'large', label: 'До 10кг'},
        {key: 'xl', label: 'Большие посылки'}
    ];

    const handleSubmit = () => {
        if (tripForm.from && tripForm.to && tripForm.date && tripForm.time) {
            onAddTrip(tripForm);
            setTripForm({
                from: '',
                to: '',
                date: '',
                time: '',
                transportType: 'plane',
                transportDetails: '',
                price: 800,
                comment: '',
                capacity: 'medium'
            });
            setShowAddTripForm(false);
        }
    };

    return (
        <div style={styles.modalOverlay} onClick={() => setShowAddTripForm(false)}>
            <div className="modal-enter" style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h3>Добавить поездку</h3>
                    <button 
                        style={styles.closeButton}
                        onClick={() => setShowAddTripForm(false)}
                    >
                        ✕
                    </button>
                </div>
                
                <div style={styles.modalContent}>
                    <div style={{
                        display: 'flex',
                        gap: 12,
                        marginBottom: 16
                    }}>
                        <div style={{flex: 1}}>
                            <label style={styles.label}>Откуда</label>
                            <input
                                list="cities-from"
                                value={tripForm.from}
                                onChange={(e) => setTripForm({...tripForm, from: e.target.value})}
                                placeholder="Город отправления"
                                style={styles.input}
                            />
                            <datalist id="cities-from">
                                {availableCities.map(city => (
                                    <option key={city} value={city} />
                                ))}
                            </datalist>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            paddingBottom: 12
                        }}>
                            <button
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--tg-theme-hint-color, #708499)',
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    padding: 8,
                                    opacity: 0.6
                                }}
                                onClick={() => {
                                    const temp = tripForm.from;
                                    setTripForm({...tripForm, from: tripForm.to, to: temp});
                                }}
                                title="Поменять местами"
                            >
                                ⇅
                            </button>
                        </div>
                        <div style={{flex: 1}}>
                            <label style={styles.label}>Куда</label>
                            <input
                                list="cities-to"
                                value={tripForm.to}
                                onChange={(e) => setTripForm({...tripForm, to: e.target.value})}
                                placeholder="Город назначения"
                                style={styles.input}
                            />
                            <datalist id="cities-to">
                                {availableCities.map(city => (
                                    <option key={city} value={city} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Тип транспорта</label>
                        <div style={styles.transportSelector}>
                            {transportTypes.map(transport => (
                                <button
                                    key={transport.key}
                                    style={{
                                        ...styles.transportButton,
                                        ...(tripForm.transportType === transport.key ? styles.transportButtonActive : {})
                                    }}
                                    onClick={() => setTripForm({...tripForm, transportType: transport.key})}
                                >
                                    {transport.icon} {transport.label.split(' ')[1]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Детали транспорта</label>
                        <input
                            value={tripForm.transportDetails}
                            onChange={(e) => setTripForm({...tripForm, transportDetails: e.target.value})}
                            placeholder={
                                tripForm.transportType === 'plane' ? 'Шереметьево → Пулково' :
                                tripForm.transportType === 'train' ? 'Поезд №123, вагон 5' :
                                tripForm.transportType === 'car' ? 'BMW X5, черный' :
                                'Автобус компании Флиxбас'
                            }
                            style={styles.input}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: 12,
                        marginBottom: 16
                    }}>
                        <div style={{flex: 1}}>
                            <label style={styles.label}>Дата</label>
                            <input
                                type="date"
                                value={tripForm.date}
                                onChange={(e) => setTripForm({...tripForm, date: e.target.value})}
                                style={styles.input}
                            />
                        </div>
                        <div style={{flex: 1}}>
                            <label style={styles.label}>Время</label>
                            <input
                                value={tripForm.time}
                                onChange={(e) => setTripForm({...tripForm, time: e.target.value})}
                                placeholder="14:30 → 16:45"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Вместимость</label>
                        <div style={styles.transportSelector}>
                            {capacityTypes.map(capacity => (
                                <button
                                    key={capacity.key}
                                    style={{
                                        ...styles.transportButton,
                                        ...(tripForm.capacity === capacity.key ? styles.transportButtonActive : {})
                                    }}
                                    onClick={() => setTripForm({...tripForm, capacity: capacity.key})}
                                >
                                    {capacity.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Цена за доставку (₽)</label>
                        <div style={styles.priceSelector}>
                            {[500, 600, 800, 1000, 1200, 1500, 2000].map(amount => (
                                <button
                                    key={amount}
                                    style={{
                                        ...styles.priceButton,
                                        ...(tripForm.price === amount ? styles.priceButtonActive : {})
                                    }}
                                    onClick={() => setTripForm({...tripForm, price: amount})}
                                >
                                    ₽{amount}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Комментарий</label>
                        <textarea
                            value={tripForm.comment}
                            onChange={(e) => setTripForm({...tripForm, comment: e.target.value})}
                            placeholder="Дополнительная информация о поездке, ограничения, особенности..."
                            style={styles.textarea}
                        />
                    </div>

                    <div style={styles.modalButtons}>
                        <button 
                            style={styles.cancelButton}
                            onClick={() => setShowAddTripForm(false)}
                        >
                            Отмена
                        </button>
                        <button 
                            style={styles.addButton}
                            onClick={handleSubmit}
                        >
                            Добавить поездку
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTripForm;