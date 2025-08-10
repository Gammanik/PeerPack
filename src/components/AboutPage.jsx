import React from 'react';

const AboutPage = ({ setShowAboutPage, animatedStats }) => {
    const styles = {
        aboutPage: {
            padding: 16,
            maxWidth: 480,
            margin: '0 auto',
            animation: 'slideIn 0.6s ease-out'
        },
        aboutHeader: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 40
        },
        backFromAboutButton: {
            alignSelf: 'flex-start',
            background: 'transparent',
            color: 'var(--tg-theme-link-color, #64b5ef)',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: 15,
            marginBottom: 20,
            transition: 'all 0.2s ease'
        },
        aboutTitle: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10
        },
        aboutLogo: {
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, var(--tg-theme-button-color, #5288c1), var(--tg-theme-accent-text-color, #64b5ef))',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            marginBottom: 12
        },
        aboutBrandTitle: {
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            color: 'var(--tg-theme-text-color, #ffffff)',
            letterSpacing: '-0.02em'
        },
        aboutContent: {
            display: 'flex',
            flexDirection: 'column',
            gap: 40
        },
        missionSection: {
            textAlign: 'center'
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #ffffff)',
            marginBottom: 16,
            textAlign: 'center'
        },
        missionText: {
            fontSize: 16,
            color: 'var(--tg-theme-hint-color, #708499)',
            lineHeight: 1.5,
            maxWidth: 400,
            margin: '0 auto'
        },
        statsSection: {
            marginBottom: 40
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
            marginTop: 20
        },
        statCard: {
            background: 'var(--tg-theme-secondary-bg-color, #232e3c)',
            border: '0.5px solid var(--tg-theme-hint-color, #708499)',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            transition: 'all 0.2s ease'
        },
        statIcon: {
            fontSize: 32,
            marginBottom: 12
        },
        statNumber: {
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--tg-theme-accent-text-color, #64b5ef)',
            marginBottom: 6
        },
        statLabel: {
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #708499)',
            fontWeight: 500
        },
        visionSection: {
            marginBottom: 40
        },
        visionGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 20,
            marginTop: 20
        },
        visionCard: {
            background: 'rgba(100, 181, 239, 0.1)',
            border: '0.5px solid rgba(100, 181, 239, 0.3)',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            transition: 'all 0.2s ease'
        },
        visionIcon: {
            fontSize: 32,
            marginBottom: 16
        },
        visionTitle: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--tg-theme-accent-text-color, #64b5ef)',
            marginBottom: 8
        },
        visionText: {
            fontSize: 13,
            color: 'var(--tg-theme-hint-color, #708499)',
            lineHeight: 1.4
        }
    };

    return (
        <div style={styles.aboutPage}>
            <div style={styles.aboutHeader}>
                <button 
                    style={styles.backFromAboutButton}
                    onClick={() => setShowAboutPage(false)}
                    className="back-from-about"
                >
                    ← Назад
                </button>
                <div style={styles.aboutTitle}>
                    <div style={styles.aboutLogo}>⚡</div>
                    <h1 style={styles.aboutBrandTitle}>PeerPack</h1>
                </div>
            </div>
            
            <div style={styles.aboutContent}>
                <div style={styles.missionSection}>
                    <h2 style={styles.sectionTitle}>О компании</h2>
                    <p style={styles.missionText}>
                        Мы соединяем людей через доверие и взаимопомощь. 
                        Каждая посылка — это возможность помочь и заработать. 
                        Просто, безопасно, надежно.
                    </p>
                </div>
                
                <div style={styles.statsSection}>
                    <h2 style={styles.sectionTitle}>Наши достижения</h2>
                    <div style={styles.statsGrid}>
                        <div className="stat-card" style={styles.statCard}>
                            <div style={styles.statIcon}>🚀</div>
                            <div style={styles.statNumber}>
                                {animatedStats.trips.toLocaleString()}
                            </div>
                            <div style={styles.statLabel}>успешных доставок</div>
                        </div>
                        
                        <div className="stat-card" style={styles.statCard}>
                            <div style={styles.statIcon}>⭐</div>
                            <div style={styles.statNumber}>
                                {animatedStats.rating.toFixed(1)}
                            </div>
                            <div style={styles.statLabel}>средний рейтинг</div>
                        </div>
                        
                        <div className="stat-card" style={styles.statCard}>
                            <div style={styles.statIcon}>🤝</div>
                            <div style={styles.statNumber}>
                                {animatedStats.couriers.toLocaleString()}
                            </div>
                            <div style={styles.statLabel}>доставщиков в сети</div>
                        </div>
                        
                        <div className="stat-card" style={styles.statCard}>
                            <div style={styles.statIcon}>✈️</div>
                            <div style={styles.statNumber}>
                                {animatedStats.totalTrips.toLocaleString()}
                            </div>
                            <div style={styles.statLabel}>общее количество поездок</div>
                        </div>
                    </div>
                </div>
                
                <div style={styles.visionSection}>
                    <h2 style={styles.sectionTitle}>Наша миссия</h2>
                    <div style={styles.visionGrid}>
                        <div className="vision-card" style={styles.visionCard}>
                            <div style={styles.visionIcon}>⚡</div>
                            <div style={styles.visionTitle}>Удобство</div>
                            <div style={styles.visionText}>Простое объявление и быстрый поиск доставщика</div>
                        </div>
                        <div className="vision-card" style={styles.visionCard}>
                            <div style={styles.visionIcon}>🔒</div>
                            <div style={styles.visionTitle}>Надежность</div>
                            <div style={styles.visionText}>Проверенные доставщики с рейтингом и отзывами</div>
                        </div>
                        <div className="vision-card" style={styles.visionCard}>
                            <div style={styles.visionIcon}>🌍</div>
                            <div style={styles.visionTitle}>Экономия</div>
                            <div style={styles.visionText}>Дешевле курьерских служб благодаря P2P модели</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;