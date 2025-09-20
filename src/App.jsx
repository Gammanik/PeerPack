import React, { useState } from 'react';
import Layout from './components/Layout.jsx';
import SearchScreen from './screens/search/SearchScreen.jsx';
import ProfileScreen from './screens/profile/ProfileScreen.jsx';
import AboutPage from './components/AboutPage.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';

const App = () => {
  const [currentPage, setCurrentPage] = useState('search');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfileScreen />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'search':
      default:
        return <SearchScreen />;
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