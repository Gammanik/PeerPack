import React, { useState } from 'react';
import Layout from './components/Layout.jsx';
import SearchScreen from './screens/search/SearchScreen.jsx';
import ProfileScreen from './screens/profile/ProfileScreen.jsx';
import ReviewsScreen from './screens/profile/ReviewsScreen.jsx';
import ParcelsScreen from './screens/parcels/ParcelsScreen.jsx';
import ParcelDetailScreen from './screens/parcels/ParcelDetailScreen.jsx';
import TripsScreen from './screens/trips/TripsScreen.jsx';
import TripDetailScreen from './screens/trips/TripDetailScreen.jsx';
import TripHistoryScreen from './screens/trips/TripHistoryScreen.jsx';
import AboutPage from './components/AboutPage.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';

const App = () => {
  const [route, setRoute] = useState({ page: 'parcels', params: {} });

  const handleNavigate = (page, params = {}) => {
    setRoute({ page, params });
  };

  const handleBack = () => {
    // Возврат к соответствующему списку
    if (route.page === 'trip-detail') {
      handleNavigate('trips');
    } else if (route.page === 'parcel-detail') {
      handleNavigate('parcels');
    } else if (route.page === 'reviews') {
      handleNavigate('profile');
    } else if (route.page === 'about') {
      handleNavigate(route.params.from || 'profile');
    } else if (route.page === 'trip-history') {
      handleNavigate('profile');
    } else {
      handleNavigate('parcels');
    }
  };

  const renderCurrentPage = () => {
    switch (route.page) {
      case 'parcels':
        return <ParcelsScreen onNavigate={handleNavigate} />;
      case 'parcel-detail':
        return (
          <ParcelDetailScreen
            parcelId={route.params.id}
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
        );
      case 'trips':
        return <TripsScreen onNavigate={handleNavigate} />;
      case 'trip-detail':
        return (
          <TripDetailScreen
            tripId={route.params.id}
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return <ProfileScreen onNavigate={handleNavigate} />;
      case 'reviews':
        return (
          <ReviewsScreen
            userId={route.params.userId}
            userName={route.params.userName}
            userAvatar={route.params.userAvatar}
            userRating={route.params.userRating}
            reviewsCount={route.params.reviewsCount}
            onBack={handleBack}
          />
        );
      case 'trip-history':
        return <TripHistoryScreen onBack={handleBack} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} onBack={handleBack} />;
      case 'search':
        return <SearchScreen onNavigate={handleNavigate} />;
      default:
        return <ParcelsScreen onNavigate={handleNavigate} />;
    }
  };

  // Скрываем нижнюю навигацию на детальных страницах
  const hideBottomNav = route.page === 'trip-detail' || route.page === 'parcel-detail' || route.page === 'reviews' || route.page === 'about' || route.page === 'trip-history';

  return (
    <LanguageProvider>
      <Layout
        currentPage={route.page}
        onNavigate={handleNavigate}
        hideBottomNav={hideBottomNav}
      >
        {renderCurrentPage()}
      </Layout>
    </LanguageProvider>
  );
};

export default App;