import React, { useState } from 'react';

const AddParcelForm = ({
    showAddParcelForm,
    setShowAddParcelForm,
    onAddParcel,
    availableCities
}) => {
    const [parcelForm, setParcelForm] = useState({
        from: '',
        to: '',
        description: '',
        weight: 1,
        reward: 1000,
        pickupLocation: '',
        deliveryLocation: '',
        comment: ''
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
        weightSelector: {
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
        },
        weightButton: {
            padding: '6px 10px',
            background: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-hint-color, #708499)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s ease'
        },
        weightButtonActive: {
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

    if (!showAddParcelForm) return null;

    const weightOptions = [0.5, 1, 2, 3, 5, 10, 15, 20];
    const rewardOptions = [500, 800, 1000, 1500, 2000, 3000, 5000];

    const handleSubmit = () => {
        if (parcelForm.from && parcelForm.to && parcelForm.description) {
            onAddParcel(parcelForm);
            setParcelForm({
                from: '',
                to: '',
                description: '',
                weight: 1,
                reward: 1000,
                pickupLocation: '',
                deliveryLocation: '',
                comment: ''
            });
            setShowAddParcelForm(false);
        } else {
            alert('Заполните обязательные поля: откуда, куда и описание');
        }
    };

    return (
        <div style={styles.modalOverlay} onClick={() => setShowAddParcelForm(false)}>
            <div className="modal-enter" style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h3>Добавить посылку</h3>
                    <button
                        style={styles.closeButton}
                        onClick={() => setShowAddParcelForm(false)}
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
                                value={parcelForm.from}
                                onChange={(e) => setParcelForm({...parcelForm, from: e.target.value})}
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
                                    const temp = parcelForm.from;
                                    setParcelForm({...parcelForm, from: parcelForm.to, to: temp});
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
                                value={parcelForm.to}
                                onChange={(e) => setParcelForm({...parcelForm, to: e.target.value})}
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
                        <label style={styles.label}>Описание посылки *</label>
                        <input
                            value={parcelForm.description}
                            onChange={(e) => setParcelForm({...parcelForm, description: e.target.value})}
                            placeholder="Документы, подарок, одежда..."
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Вес посылки (кг)</label>
                        <div style={styles.weightSelector}>
                            {weightOptions.map(weight => (
                                <button
                                    key={weight}
                                    style={{
                                        ...styles.weightButton,
                                        ...(parcelForm.weight === weight ? styles.weightButtonActive : {})
                                    }}
                                    onClick={() => setParcelForm({...parcelForm, weight})}
                                >
                                    {weight} кг
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Место забора</label>
                        <input
                            value={parcelForm.pickupLocation}
                            onChange={(e) => setParcelForm({...parcelForm, pickupLocation: e.target.value})}
                            placeholder="Адрес или метро"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Место доставки</label>
                        <input
                            value={parcelForm.deliveryLocation}
                            onChange={(e) => setParcelForm({...parcelForm, deliveryLocation: e.target.value})}
                            placeholder="Адрес или метро"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Вознаграждение (₽)</label>
                        <div style={styles.priceSelector}>
                            {rewardOptions.map(amount => (
                                <button
                                    key={amount}
                                    style={{
                                        ...styles.priceButton,
                                        ...(parcelForm.reward === amount ? styles.priceButtonActive : {})
                                    }}
                                    onClick={() => setParcelForm({...parcelForm, reward: amount})}
                                >
                                    ₽{amount}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Дополнительная информация</label>
                        <textarea
                            value={parcelForm.comment}
                            onChange={(e) => setParcelForm({...parcelForm, comment: e.target.value})}
                            placeholder="Хрупкое, срочно, особенности упаковки..."
                            style={styles.textarea}
                        />
                    </div>

                    <div style={styles.modalButtons}>
                        <button
                            style={{...styles.addButton, flex: 'none', width: '100%'}}
                            onClick={handleSubmit}
                        >
                            📦 Создать посылку
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddParcelForm;
