import React from 'react';

const AboutPage = ({ setShowAboutPage, animatedStats }) => {
    const styles = {
        aboutPage: {
            padding: 20,
            maxWidth: 800,
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
            color: '#aaa',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: 14,
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
            fontSize: 48,
            filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.8))',
            animation: 'logoGlow 3s ease-in-out infinite alternate'
        },
        aboutBrandTitle: {
            fontSize: 32,
            fontWeight: 800,
            margin: 0,
            background: 'linear-gradient(135deg, #FFD700, #00bfa6, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 100%',
            animation: 'shimmerText 3s ease-in-out infinite'
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
            fontSize: 24,
            fontWeight: 700,
            color: 'white',
            marginBottom: 20,
            textAlign: 'center'
        },
        missionText: {
            fontSize: 18,
            color: '#ddd',
            lineHeight: 1.6,
            maxWidth: 600,
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
            background: 'linear-gradient(135deg, #2b2b2b, #1a1a1a)',
            border: '1px solid #3a3a3a',
            borderRadius: 16,
            padding: 24,
            textAlign: 'center',
            transition: 'all 0.3s ease'
        },
        statIcon: {
            fontSize: 32,
            marginBottom: 12
        },
        statNumber: {
            fontSize: 28,
            fontWeight: 700,
            color: '#00bfa6',
            marginBottom: 8
        },
        statLabel: {
            fontSize: 14,
            color: '#aaa',
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
            background: 'linear-gradient(135deg, rgba(255,215,0,0.05), rgba(0,191,166,0.05))',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: 16,
            padding: 24,
            textAlign: 'center',
            transition: 'all 0.3s ease'
        },
        visionIcon: {
            fontSize: 32,
            marginBottom: 16
        },
        visionTitle: {
            fontSize: 18,
            fontWeight: 600,
            color: '#FFD700',
            marginBottom: 12
        },
        visionText: {
            fontSize: 14,
            color: '#ccc',
            lineHeight: 1.5
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