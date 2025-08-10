import React from 'react';

const RequestForm = ({
    selectedCourier,
    showRequestForm,
    setShowRequestForm,
    requestForm,
    setRequestForm,
    handleSendRequest
}) => {
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
            backgroundColor: '#2b2b2b',
            borderRadius: 16,
            padding: 0,
            maxWidth: 500,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        },
        modalHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 20px 10px',
            borderBottom: '1px solid #3a3a3a',
            color: 'white'
        },
        closeButton: {
            background: 'transparent',
            border: 'none',
            color: '#aaa',
            fontSize: 20,
            cursor: 'pointer'
        },
        modalContent: {
            padding: 20,
            maxHeight: 'calc(80vh - 70px)',
            overflowY: 'auto',
            color: 'white'
        },
        formGroup: {
            marginBottom: 15
        },
        label: {
            color: '#aaa',
            marginBottom: 5,
            display: 'block',
            fontSize: 14,
            fontWeight: 600
        },
        textarea: {
            width: '100%',
            padding: 10,
            background: '#1c1c1c',
            border: '1px solid #3a3a3a',
            borderRadius: 8,
            color: 'white',
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
            padding: '8px 12px',
            background: '#1c1c1c',
            color: '#aaa',
            border: '1px solid #3a3a3a',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
            transition: 'all 0.2s ease'
        },
        rewardButtonActive: {
            background: '#00bfa6',
            color: 'black',
            border: '1px solid #00bfa6'
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
            color: '#aaa',
            border: '1px solid #3a3a3a',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: 14
        },
        sendButton: {
            flex: 1,
            padding: 12,
            backgroundColor: '#00bfa6',
            color: 'black',
            border: 'none',
            borderRadius: 10,
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: 14
        },
        tripInfo: {
            marginBottom: 20,
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
                        <label style={styles.label}>Описание посылки</label>
                        <textarea
                            value={requestForm.packageDescription}
                            onChange={(e) => setRequestForm({...requestForm, packageDescription: e.target.value})}
                            placeholder="Опишите что нужно доставить (размер, вес, хрупкость)"
                            style={styles.textarea}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Сообщение курьеру</label>
                        <textarea
                            value={requestForm.message}
                            onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                            placeholder="Дополнительная информация, особые пожелания"
                            style={styles.textarea}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Вознаграждение (в звездах)</label>
                        <div style={styles.rewardSelector}>
                            {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                <button
                                    key={num}
                                    style={{
                                        ...styles.rewardButton,
                                        ...(requestForm.reward === num ? styles.rewardButtonActive : {})
                                    }}
                                    onClick={() => setRequestForm({...requestForm, reward: num})}
                                >
                                    {num}★
                                </button>
                            ))}
                        </div>
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