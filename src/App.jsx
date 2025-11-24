import React, { useState } from 'react';
import Layout from './components/Layout.jsx';
import SearchScreen from './screens/search/SearchScreen.jsx';
import ProfileScreen from './screens/profile/ProfileScreen.jsx';
import ParcelsScreen from './screens/parcels/ParcelsScreen.jsx';
import TripsScreen from './screens/trips/TripsScreen.jsx';
import AboutPage from './components/AboutPage.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';

const App = () => {
  const [currentPage, setCurrentPage] = useState('parcels');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'parcels':
        return <ParcelsScreen onNavigate={handleNavigate} />;
      case 'trips':
        return <TripsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'search':
        return <SearchScreen />;
      default:
        return <ParcelsScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <LanguageProvider>
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderCurrentPage()}
      </Layout>
    </LanguageProvider>
  );
};

export default App;