import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../shared/context/AppContext.jsx';
import { supabaseApi } from '../../../services/supabaseApi';

const ProfilePage = ({ 
    setShowProfilePage, 
    myPackages,
    userTrips,
    setSelectedPackage,
    setSelectedTrip
}) => {
    const { navigateTo } = useAppContext();
    const [allTripRequests, setAllTripRequests] = useState([]);
    const [requestsLoading, setRequestsLoading] = useState(true);

    // Загружаем заявки для всех поездок пользователя
    useEffect(() => {
        const loadAllRequests = async () => {
            try {
                setRequestsLoading(true);
                const requests = [];

                for (const trip of userTrips) {
                    try {
                        const tripRequestsData = await supabaseApi.getOffersForTrip(trip.id);
                        requests.push(...(tripRequestsData.offers || []));
                    } catch (error) {
                        console.error(`Ошибка загрузки заявок для поездки ${trip.id}:`, error);
                    }
                }

                setAllTripRequests(requests);
            } catch (error) {
                console.error('Ошибка загрузки заявок:', error);
            } finally {
                setRequestsLoading(false);
            }
        };

        if (userTrips.length > 0) {
            loadAllRequests();
        } else {
            setRequestsLoading(false);
        }
    }, [userTrips]);
    const [activeTab, setActiveTab] = useState('packages');
    const [notificationCount] = useState(6); // Mock count from API
    const [showStats, setShowStats] = useState(false);

    const packageTemplates = myPackages.filter(pkg => pkg.status === 'template' || pkg.status === 'active' || pkg.status === 'waiting');
    const completedPackages = myPackages.filter(pkg => pkg.status === 'completed');
    
    // Calculate statistics
    const totalPackages = myPackages.length;
    const activePackages = packageTemplates.length;
    const totalTrips = userTrips.length;
    const totalRequests = allTripRequests.length;
    const newRequests = allTripRequests.filter(req => req.is_new && req.status === 'pending').length;

    const styles = {
        container: {
            width: '100%',
            maxWidth: 480,
            minHeight: '100vh',
            background: 'var(--tg-theme-bg-color, #17212b)',
            color: 'var(--tg-theme-text-color, #ffffff)',
            padding: '16px',
            paddingBottom: '96px'
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '0.5px solid var(--tg-theme-hint-color, #708499)'
        },
        backButton: {
            background: 'transparent',
            border: 'none',
            color: 'var(--tg-theme-link-color, #64b5ef)',
            fontSize: 16,
            cursor: 'pointer',
            fontWeight: 500
        },
        title: {
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        tabs: {
            display: 'flex',
            marginBottom: 20,
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            borderRadius: 8,
            padding: 4
        },
        tab: {
            flex: 1,
            padding: '8px 12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            borderRadius: 6,
            transition: 'all 0.2s ease'
        },
        activeTab: {
            background: 'var(--tg-theme-button-color, #5288c1)',
            color: 'var(--tg-theme-button-text-color, #ffffff)'
        },
        requestCard: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12
        },
        userTripCard: {
            background: 'rgba(112, 132, 153, 0.1)',
            border: '0.5px solid rgba(112, 132, 153, 0.3)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            opacity: 0.8
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
        },
        route: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)'
        },
        status: {
            padding: '4px 8px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 500
        },
        details: {
            fontSize: 14,
            color: 'var(--tg-theme-hint-color, #708499)',
            marginBottom: 8
        },
        message: {
            fontSize: 13,
            color: 'var(--tg-theme-text-color, #ffffff)',
            backgroundColor: 'rgba(100, 181, 239, 0.1)',
            padding: 8,
            borderRadius: 6,
            marginTop: 8
        },
        emptyState: {
            textAlign: 'center',
            color: 'var(--tg-theme-hint-color, #708499)',
            fontSize: 15,
            padding: '40px 20px'
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: 8
        }
    };


    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button 
                    style={styles.backButton}
                    onClick={() => setShowProfilePage(false)}
                >
                    ← Назад
                </button>
                <div style={styles.title}>Профиль</div>
                <button 
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--tg-theme-text-color, #ffffff)',
                        fontSize: 20,
                        cursor: 'pointer',
                        position: 'relative',
                        padding: 8
                    }}
                    onClick={() => navigateTo('notifications')}
                >
                    🔔
                    {notificationCount > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            background: '#FF3B30',
                            color: 'white',
                            borderRadius: '50%',
                            width: 18,
                            height: 18,
                            fontSize: 10,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {notificationCount > 9 ? '9+' : notificationCount}
                        </div>
                    )}
                </button>
            </div>

            {/* Statistics Section */}
            <div style={{
                background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
                borderRadius: 12,
                marginBottom: 16,
                overflow: 'hidden',
                border: '0.5px solid var(--tg-theme-hint-color, #708499)'
            }}>
                <button
                    onClick={() => setShowStats(!showStats)}
                    style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        color: 'var(--tg-theme-text-color, #ffffff)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span style={{ fontSize: 16 }}>📊</span>
                        <span style={{ fontSize: 15, fontWeight: 500 }}>Статистика</span>
                        {newRequests > 0 && (
                            <div style={{
                                background: '#FF3B30',
                                color: 'white',
                                borderRadius: '50%',
                                width: 18,
                                height: 18,
                                fontSize: 10,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {newRequests > 9 ? '9+' : newRequests}
                            </div>
                        )}
                    </div>
                    <span style={{
                        fontSize: 12,
                        color: 'var(--tg-theme-hint-color, #708499)',
                        transform: showStats ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                    }}>▼</span>
                </button>
                
                {showStats && (
                    <div style={{
                        padding: '0 16px 16px',
                        animation: 'slideIn 0.2s ease-out'
                    }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 12,
                            marginBottom: 12
                        }}>
                            <div style={{
                                background: 'var(--tg-theme-bg-color, #17212b)',
                                borderRadius: 8,
                                padding: 12,
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    fontSize: 20,
                                    fontWeight: 600,
                                    color: 'var(--tg-theme-accent-text-color, #64b5ef)',
                                    marginBottom: 4
                                }}>{totalPackages}</div>
                                <div style={{
                                    fontSize: 12,
                                    color: 'var(--tg-theme-hint-color, #708499)'
                                }}>📦 Всего посылок</div>
                            </div>
                            
                            <div style={{
                                background: 'var(--tg-theme-bg-color, #17212b)',
                                borderRadius: 8,
                                padding: 12,
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    fontSize: 20,
                                    fontWeight: 600,
                                    color: activePackages > 0 ? '#4BB34B' : 'var(--tg-theme-hint-color, #708499)',
                                    marginBottom: 4
                                }}>{activePackages}</div>
                                <div style={{
                                    fontSize: 12,
                                    color: 'var(--tg-theme-hint-color, #708499)'
                                }}>⚡ Активных</div>
                            </div>
                            
                            <div style={{
                                background: 'var(--tg-theme-bg-color, #17212b)',
                                borderRadius: 8,
                                padding: 12,
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    fontSize: 20,
                                    fontWeight: 600,
                                    color: 'var(--tg-theme-accent-text-color, #64b5ef)',
                                    marginBottom: 4
                                }}>{totalTrips}</div>
                                <div style={{
                                    fontSize: 12,
                                    color: 'var(--tg-theme-hint-color, #708499)'
                                }}>✈️ Поездок</div>
                            </div>
                            
                            <div style={{
                                background: 'var(--tg-theme-bg-color, #17212b)',
                                borderRadius: 8,
                                padding: 12,
                                textAlign: 'center',
                                ...(newRequests > 0 ? {
                                    border: '1px solid #FF3B30',
                                    background: 'rgba(255, 59, 48, 0.1)'
                                } : {})
                            }}>
                                <div style={{
                                    fontSize: 20,
                                    fontWeight: 600,
                                    color: totalRequests > 0 ? '#FFD700' : 'var(--tg-theme-hint-color, #708499)',
                                    marginBottom: 4
                                }}>{totalRequests}</div>
                                <div style={{
                                    fontSize: 12,
                                    color: 'var(--tg-theme-hint-color, #708499)'
                                }}>📨 Заявок</div>
                                {newRequests > 0 && (
                                    <div style={{
                                        fontSize: 10,
                                        color: '#FF3B30',
                                        fontWeight: 600,
                                        marginTop: 2
                                    }}>+{newRequests} новых</div>
                                )}
                            </div>
                        </div>
                        
                        <div style={{
                            background: 'linear-gradient(90deg, rgba(82, 136, 193, 0.1) 0%, rgba(100, 181, 239, 0.1) 100%)',
                            borderRadius: 8,
                            padding: 10,
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: 13,
                                color: 'var(--tg-theme-text-color, #ffffff)',
                                fontWeight: 500
                            }}>
                                🏆 Уровень активности
                            </div>
                            <div style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: 'var(--tg-theme-accent-text-color, #64b5ef)',
                                marginTop: 4
                            }}>
                                {totalPackages + totalTrips === 0 ? 'Новичок' :
                                 totalPackages + totalTrips < 5 ? 'Начинающий' :
                                 totalPackages + totalTrips < 15 ? 'Активный' : 'Эксперт'}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={styles.tabs}>
                <button 
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'packages' ? styles.activeTab : {})
                    }}
                    onClick={() => setActiveTab('packages')}
                >
                    📦 Посылки ({myPackages.length})
                </button>
                <button 
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'trips' ? styles.activeTab : {})
                    }}
                    onClick={() => setActiveTab('trips')}
                >
                    ✈️ Поездки ({userTrips.length})
                </button>
            </div>

            {activeTab === 'trips' && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(82, 136, 193, 0.1) 0%, rgba(100, 181, 239, 0.1) 100%)',
                    border: '1px dashed rgba(82, 136, 193, 0.3)',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 20,
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: 32,
                        marginBottom: 8
                    }}>✈️</div>
                    <div style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: 'var(--tg-theme-text-color, #ffffff)',
                        marginBottom: 6
                    }}>
                        Планируете поездку?
                    </div>
                    <div style={{
                        fontSize: 13,
                        color: 'var(--tg-theme-hint-color, #708499)',
                        marginBottom: 16,
                        lineHeight: 1.4
                    }}>
                        Создайте поездку и получайте заявки на доставку от отправителей
                    </div>
                    <button
                        onClick={() => {
                            setShowProfilePage(false);
                            window.dispatchEvent(new CustomEvent('switchToAddTrip'));
                        }}
                        style={{
                            background: 'var(--tg-theme-button-color, #5288c1)',
                            color: 'var(--tg-theme-button-text-color, #ffffff)',
                            border: 'none',
                            borderRadius: 12,
                            padding: '12px 24px',
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            margin: '0 auto',
                            boxShadow: '0 2px 8px rgba(82, 136, 193, 0.3)'
                        }}
                    >
                        <span>➕</span>
                        Добавить поездку
                    </button>
                </div>
            )}

            {activeTab === 'packages' ? (
                <div>
                    {packageTemplates.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: 'var(--tg-theme-text-color, #ffffff)',
                                marginBottom: 12
                            }}>Мои посылки</h3>
                            
                            {packageTemplates.map(packageData => {
                                const responses = packageData.responses || [];
                                const hasNewResponses = responses.length > 0 && responses.some(r => r.isNew);
                                const responsesCount = responses.length;
                                const isTemplate = packageData.status === 'template';
                                
                                return (
                                    <div 
                                        key={packageData.id} 
                                        style={{
                                            ...styles.requestCard,
                                            cursor: 'pointer',
                                            ...(hasNewResponses ? {
                                                border: '0.5px solid rgba(255, 215, 0, 0.6)',
                                                background: 'rgba(255, 215, 0, 0.05)'
                                            } : {}),
                                            ...(isTemplate ? {
                                                border: '0.5px solid rgba(100, 181, 239, 0.3)',
                                                background: 'rgba(100, 181, 239, 0.05)'
                                            } : {})
                                        }}
                                        onClick={() => setSelectedPackage(packageData)}
                                    >
                                        <div style={styles.cardHeader}>
                                            <div style={styles.route}>{packageData.from} → {packageData.to}</div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8
                                            }}>
                                                {hasNewResponses && (
                                                    <div style={{
                                                        background: '#FFD700',
                                                        color: '#1a1a1a',
                                                        padding: '2px 6px',
                                                        borderRadius: 8,
                                                        fontSize: 10,
                                                        fontWeight: 600
                                                    }}>
                                                        NEW
                                                    </div>
                                                )}
                                                {responses.length > 0 && !isTemplate && (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginRight: 8
                                                    }}>
                                                        {responses.slice(0, 3).map((response, index) => (
                                                            <img 
                                                                key={response.id}
                                                                src={response.courier_avatar || response.courierAvatar} 
                                                                alt={response.courier_name || response.courierName}
                                                                style={{
                                                                    ...styles.avatar,
                                                                    width: 24,
                                                                    height: 24,
                                                                    marginRight: index < 2 ? -8 : 4,
                                                                    border: '1px solid var(--tg-theme-bg-color, #17212b)',
                                                                    zIndex: 3 - index
                                                                }}
                                                            />
                                                        ))}
                                                        {responses.length > 3 && (
                                                            <div style={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '50%',
                                                                background: 'var(--tg-theme-hint-color, #708499)',
                                                                color: 'white',
                                                                fontSize: 10,
                                                                fontWeight: 600,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginLeft: -8
                                                            }}>
                                                                +{responses.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div style={{
                                                    ...styles.status,
                                                    backgroundColor: isTemplate ? '#64b5ef' : 
                                                        (packageData.status === 'active' ? '#4BB34B' : '#FFD700'),
                                                    color: 'white'
                                                }}>
                                                    {isTemplate ? 'Шаблон' : `${responsesCount} откликов`}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={styles.details}>
                                            📦 {packageData.description} • ₽{packageData.reward}
                                            {packageData.size && packageData.weight && (
                                                <span style={{ marginLeft: 8, opacity: 0.7 }}>
                                                    • {packageData.size.toUpperCase()} • {packageData.weight}
                                                </span>
                                            )}
                                        </div>
                                        {packageData.tags && packageData.tags.length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                gap: 4,
                                                marginTop: 8,
                                                flexWrap: 'wrap'
                                            }}>
                                                {packageData.tags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        style={{
                                                            background: 'rgba(100, 181, 239, 0.2)',
                                                            color: 'var(--tg-theme-accent-text-color, #64b5ef)',
                                                            padding: '2px 6px',
                                                            borderRadius: 4,
                                                            fontSize: 10,
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {tag === 'fragile' ? '🔸 Хрупкое' :
                                                         tag === 'urgent' ? '⚡ Срочно' :
                                                         tag === 'valuable' ? '💎 Ценное' :
                                                         tag === 'documents' ? '📄 Документы' : tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {isTemplate && (
                                            <div style={{
                                                fontSize: 12,
                                                color: 'var(--tg-theme-hint-color, #708499)',
                                                marginTop: 8
                                            }}>
                                                👆 Нажмите чтобы отправить курьерам
                                            </div>
                                        )}
                                        {packageData.message && (
                                            <div style={styles.message}>💬 {packageData.message}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {completedPackages.length > 0 && (
                        <div>
                            <h3 style={{
                                fontSize: 16,
                                fontWeight: 600,
                                color: 'var(--tg-theme-text-color, #ffffff)',
                                marginBottom: 12
                            }}>Завершенные</h3>
                            
                            {completedPackages.map(packageData => (
                                <div key={packageData.id} style={styles.requestCard}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.route}>{packageData.from} → {packageData.to}</div>
                                        <div style={{
                                            ...styles.status,
                                            backgroundColor: '#4BB34B',
                                            color: 'white'
                                        }}>
                                            Доставлено
                                        </div>
                                    </div>
                                    <div style={styles.details}>
                                        📦 {packageData.description} • ₽{packageData.reward}
                                    </div>
                                    <div style={styles.details}>
                                        👤 Курьер: {packageData.selectedCourier}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {myPackages.length === 0 && (
                        <div style={styles.emptyState}>
                            У вас пока нет посылок
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {userTrips.map((trip) => {
                        // Получаем заявки для этой поездки  
                        const tripRequests = allTripRequests.filter(req => req.trip_id === trip.id);
                        const newRequests = tripRequests.filter(req => req.is_new && req.status === 'pending');
                        const totalRequests = tripRequests.length;
                        
                        return (
                            <div 
                                key={trip.id} 
                                style={{
                                    ...styles.userTripCard,
                                    cursor: 'pointer',
                                    ...(newRequests.length > 0 ? {
                                        border: '0.5px solid rgba(255, 215, 0, 0.6)',
                                        background: 'rgba(255, 215, 0, 0.05)'
                                    } : {})
                                }}
                                onClick={() => setSelectedTrip && setSelectedTrip(trip)}
                            >
                                <div style={styles.cardHeader}>
                                    <div style={styles.route}>{trip.from} → {trip.to}</div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                    }}>
                                        {tripRequests.length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginRight: 8
                                            }}>
                                                {tripRequests.slice(0, 3).map((request, index) => (
                                                    <img 
                                                        key={request.id}
                                                        src={request.sender_avatar} 
                                                        alt={request.sender_name}
                                                        style={{
                                                            ...styles.avatar,
                                                            width: 24,
                                                            height: 24,
                                                            marginRight: index < 2 ? -8 : 4,
                                                            border: '1px solid var(--tg-theme-bg-color, #17212b)',
                                                            zIndex: 3 - index
                                                        }}
                                                    />
                                                ))}
                                                {tripRequests.length > 3 && (
                                                    <div style={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        background: 'var(--tg-theme-hint-color, #708499)',
                                                        color: 'white',
                                                        fontSize: 10,
                                                        fontWeight: 600,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginLeft: -8
                                                    }}>
                                                        +{tripRequests.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {newRequests.length > 0 && (
                                            <div style={{
                                                background: '#FFD700',
                                                color: '#1a1a1a',
                                                padding: '2px 6px',
                                                borderRadius: 8,
                                                fontSize: 10,
                                                fontWeight: 600
                                            }}>
                                                {newRequests.length} NEW
                                            </div>
                                        )}
                                        <div style={{
                                            ...styles.status,
                                            backgroundColor: totalRequests > 0 ? '#4BB34B' : '#708499',
                                            color: 'white'
                                        }}>
                                            {totalRequests > 0 ? `${totalRequests} заявок` : 'Ваша поездка'}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.details}>
                                    🛫 {trip.airport} • 🕐 {trip.time}
                                </div>
                                <div style={styles.details}>
                                    🗓 {trip.date} • ₽{trip.price}
                                </div>
                                <div style={styles.message}>
                                    💬 {trip.tripComment}
                                </div>
                                {totalRequests > 0 && (
                                    <div style={{
                                        marginTop: 8,
                                        fontSize: 12,
                                        color: 'var(--tg-theme-link-color, #64b5ef)',
                                        fontWeight: 500
                                    }}>
                                        👆 Нажмите для просмотра заявок на доставку
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {userTrips.length === 0 && (
                        <div style={styles.emptyState}>
                            У вас пока нет поездок
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;