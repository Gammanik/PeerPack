import React from 'react';

const RequestForm = ({
    selectedCourier,
    showRequestForm,
    setShowRequestForm,
    requestForm,
    setRequestForm,
    handleSendRequest,
    myPackages,
    useExistingPackage,
    setUseExistingPackage
}) => {
    const [selectedPackageTemplate, setSelectedPackageTemplate] = React.useState(null);
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
            maxHeight: '85vh',
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
            maxHeight: 'calc(85vh - 60px)',
            overflowY: 'auto',
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        formGroup: {
            marginBottom: 15
        },
        label: {
            color: 'var(--tg-theme-hint-color, #708499)',
            marginBottom: 6,
            display: 'block',
            fontSize: 14,
            fontWeight: 500
        },
        textarea: {
            width: '100%',
            padding: 12,
            background: 'var(--tg-theme-bg-color, #17212b)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            color: 'var(--tg-theme-text-color, #ffffff)',
            fontSize: 14,
            minHeight: 80,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box'
        },
        rewardSelector: {
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
        },
        rewardButton: {
            padding: '6px 10px',
            background: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-hint-color, #708499)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s ease'
        },
        rewardButtonActive: {
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
        sendButton: {
            flex: 1,
            padding: 12,
            backgroundColor: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14
        },
        tripInfo: {
            marginBottom: 16,
            fontSize: 14
        }
    };

    if (!showRequestForm || !selectedCourier) return null;

    return (
        <div style={styles.modalOverlay} onClick={() => setShowRequestForm(false)}>
            <div className="modal-enter" style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <h3>Заявка на доставку</h3>
                    <button 
                        style={styles.closeButton}
                        onClick={() => setShowRequestForm(false)}
                    >
                        ✕
                    </button>
                </div>
                
                <div style={styles.modalContent}>
                    <div style={styles.tripInfo}>
                        <p><strong>Курьер:</strong> {selectedCourier.name}</p>
                        <p><strong>Маршрут:</strong> {selectedCourier.from} → {selectedCourier.to}</p>
                        <p><strong>Дата:</strong> {selectedCourier.date}</p>
                    </div>

                    <div style={styles.formGroup}>
                        <div style={{
                            display: 'flex',
                            gap: 8,
                            marginBottom: 12
                        }}>
                            <button
                                style={{
                                    ...styles.rewardButton,
                                    flex: 1,
                                    ...(!useExistingPackage ? styles.rewardButtonActive : {})
                                }}
                                onClick={() => {
                                    setUseExistingPackage(false);
                                    setSelectedPackageTemplate(null);
                                }}
                            >
                                📝 Новая посылка
                            </button>
                            <button
                                style={{
                                    ...styles.rewardButton,
                                    flex: 1,
                                    ...(useExistingPackage ? styles.rewardButtonActive : {})
                                }}
                                onClick={() => setUseExistingPackage(true)}
                            >
                                📦 Из шаблонов ({myPackages.length})
                            </button>
                        </div>
                    </div>

                    {useExistingPackage ? (
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Выберите посылку</label>
                            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                {myPackages.map(pkg => (
                                    <div
                                        key={pkg.id}
                                        style={{
                                            ...styles.rewardButton,
                                            width: '100%',
                                            textAlign: 'left',
                                            marginBottom: 8,
                                            padding: 12,
                                            cursor: 'pointer',
                                            ...(selectedPackageTemplate?.id === pkg.id ? styles.rewardButtonActive : {})
                                        }}
                                        onClick={() => {
                                            setSelectedPackageTemplate(pkg);
                                            setRequestForm({
                                                ...requestForm,
                                                packageDescription: pkg.description,
                                                reward: pkg.reward,
                                                message: ''
                                            });
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                            {pkg.from} → {pkg.to}
                                        </div>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>
                                            📦 {pkg.description} • ₽{pkg.reward}
                                        </div>
                                    </div>
                                ))}
                                {myPackages.length === 0 && (
                                    <div style={{
                                        textAlign: 'center',
                                        color: 'var(--tg-theme-hint-color, #708499)',
                                        fontSize: 14,
                                        padding: 20
                                    }}>
                                        У вас пока нет созданных посылок
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Описание посылки</label>
                                <textarea
                                    value={requestForm.packageDescription}
                                    onChange={(e) => setRequestForm({...requestForm, packageDescription: e.target.value})}
                                    placeholder="Опишите что нужно доставить (размер, вес, хрупкость)"
                                    style={styles.textarea}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Вознаграждение (₽)</label>
                                <div style={styles.rewardSelector}>
                                    {[500, 600, 800, 1000, 1200, 1500, 2000].map(amount => (
                                        <button
                                            key={amount}
                                            style={{
                                                ...styles.rewardButton,
                                                ...(requestForm.reward === amount ? styles.rewardButtonActive : {})
                                            }}
                                            onClick={() => setRequestForm({...requestForm, reward: amount})}
                                        >
                                            ₽{amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            {useExistingPackage ? 'Дополнительное сообщение курьеру' : 'Сообщение курьеру'}
                        </label>
                        <textarea
                            value={requestForm.message}
                            onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                            placeholder={useExistingPackage ? 
                                "Дополнительные пожелания или уточнения для этого курьера" : 
                                "Дополнительная информация, особые пожелания"
                            }
                            style={styles.textarea}
                        />
                    </div>

                    <div style={styles.modalButtons}>
                        <button 
                            style={styles.cancelButton}
                            onClick={() => setShowRequestForm(false)}
                        >
                            Отмена
                        </button>
                        <button 
                            style={styles.sendButton}
                            onClick={() => {
                                handleSendRequest();
                                setShowRequestForm(false);
                            }}
                        >
                            Отправить заявку
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestForm;