import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const WalletTab = ({ userBalance }) => {
    const [transactions, setTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    
    // Загружаем историю транзакций (в реальном приложении)
    useEffect(() => {
        const loadTransactions = async () => {
            try {
                setTransactionsLoading(true);
                // const response = await apiService.getUserTransactions();
                // setTransactions(response.transactions || []);
                
                // Пока используем мок-данные
                await new Promise(resolve => setTimeout(resolve, 500));
                setTransactions(mockTransactions);
            } catch (error) {
                console.error('Ошибка загрузки транзакций:', error);
            } finally {
                setTransactionsLoading(false);
            }
        };
        
        loadTransactions();
    }, []);
    const styles = {
        container: {
            width: '100%'
        },
        balanceCard: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            textAlign: 'center'
        },
        totalBalance: {
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--tg-theme-button-color, #5288c1)',
            marginBottom: 8
        },
        balanceLabel: {
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #708499)',
            marginBottom: 20
        },
        balanceBreakdown: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12
        },
        balanceItem: {
            flex: 1,
            textAlign: 'center',
            padding: '12px 8px',
            background: 'var(--tg-theme-bg-color, #17212b)',
            borderRadius: 8,
            border: '0.5px solid var(--tg-theme-hint-color, #708499)'
        },
        balanceAmount: {
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 4
        },
        availableAmount: {
            color: '#4BB34B'
        },
        frozenAmount: {
            color: '#FF8C00'
        },
        pendingAmount: {
            color: '#FFD700'
        },
        balanceItemLabel: {
            fontSize: 12,
            color: 'var(--tg-theme-hint-color, #708499)',
            fontWeight: 500
        },
        infoCard: {
            background: 'rgba(100, 181, 239, 0.1)',
            border: '0.5px solid rgba(100, 181, 239, 0.3)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20
        },
        infoTitle: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-accent-text-color, #64b5ef)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8
        },
        infoText: {
            fontSize: 13,
            color: 'var(--tg-theme-text-color, #ffffff)',
            lineHeight: 1.4,
            marginBottom: 8
        },
        withdrawButton: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: 'none',
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            marginTop: 8,
            disabled: userBalance.available === 0
        },
        transactionHistory: {
            marginTop: 20
        },
        transactionItem: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        transactionInfo: {
            flex: 1
        },
        transactionDesc: {
            fontSize: 14,
            color: 'var(--tg-theme-text-color, #ffffff)',
            fontWeight: 500,
            marginBottom: 2
        },
        transactionDate: {
            fontSize: 12,
            color: 'var(--tg-theme-hint-color, #708499)'
        },
        transactionAmount: {
            fontSize: 16,
            fontWeight: 600,
            color: '#4BB34B'
        }
    };

    const mockTransactions = [
        {
            id: 1,
            description: 'Доставка: Документы',
            date: '10 авг, 14:30',
            amount: 800,
            type: 'income'
        },
        {
            id: 2,
            description: 'Доставка: Лекарства',
            date: '9 авг, 16:45',
            amount: 1000,
            type: 'income'
        },
        {
            id: 3,
            description: 'Доставка: Подарок',
            date: '8 авг, 12:20',
            amount: 600,
            type: 'income'
        }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.balanceCard}>
                <div style={styles.totalBalance}>
                    ₽{(userBalance.available + userBalance.frozen + userBalance.pending).toLocaleString()}
                </div>
                <div style={styles.balanceLabel}>Общий баланс</div>
                
                <div style={styles.balanceBreakdown}>
                    <div style={styles.balanceItem}>
                        <div style={{
                            ...styles.balanceAmount,
                            ...styles.availableAmount
                        }}>
                            ₽{userBalance.available.toLocaleString()}
                        </div>
                        <div style={styles.balanceItemLabel}>Доступно</div>
                    </div>
                    
                    <div style={styles.balanceItem}>
                        <div style={{
                            ...styles.balanceAmount,
                            ...styles.frozenAmount
                        }}>
                            ₽{userBalance.frozen.toLocaleString()}
                        </div>
                        <div style={styles.balanceItemLabel}>В заморозке</div>
                    </div>
                    
                    <div style={styles.balanceItem}>
                        <div style={{
                            ...styles.balanceAmount,
                            ...styles.pendingAmount
                        }}>
                            ₽{userBalance.pending.toLocaleString()}
                        </div>
                        <div style={styles.balanceItemLabel}>Ожидают</div>
                    </div>
                </div>
            </div>

            <div style={styles.infoCard}>
                <div style={styles.infoTitle}>
                    💰 Как работают платежи
                </div>
                <div style={styles.infoText}>
                    • <strong>Доступно:</strong> деньги, которые можно вывести
                </div>
                <div style={styles.infoText}>
                    • <strong>В заморозке:</strong> заблокировано до подтверждения доставки
                </div>
                <div style={styles.infoText}>
                    • <strong>Ожидают:</strong> доставлено, ждем подтверждения получателя
                </div>
            </div>

            <button 
                style={{
                    ...styles.withdrawButton,
                    opacity: userBalance.available === 0 ? 0.5 : 1
                }}
                disabled={userBalance.available === 0}
                onClick={async () => {
                    if (userBalance.available > 0) {
                        try {
                            await apiService.withdrawBalance(userBalance.available);
                            alert(`Запрос на вывод ₽${userBalance.available} отправлен`);
                        } catch (error) {
                            console.error('Ошибка вывода:', error);
                            alert('Ошибка вывода средств');
                        }
                    }
                }}
            >
                💳 Вывести ₽{userBalance.available.toLocaleString()}
            </button>

            <div style={styles.transactionHistory}>
                <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--tg-theme-text-color, #ffffff)',
                    marginBottom: 12
                }}>История операций</h3>
                
                {transactionsLoading ? (
                    <div style={{
                        textAlign: 'center',
                        color: 'var(--tg-theme-hint-color, #708499)',
                        padding: 20
                    }}>
                        Загрузка истории...
                    </div>
                ) : transactions.map(transaction => (
                    <div key={transaction.id} style={styles.transactionItem}>
                        <div style={styles.transactionInfo}>
                            <div style={styles.transactionDesc}>{transaction.description}</div>
                            <div style={styles.transactionDate}>{transaction.date}</div>
                        </div>
                        <div style={styles.transactionAmount}>
                            +₽{transaction.amount}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalletTab;