import React from 'react';
import { useAppContext } from '../shared/context/AppContext.jsx';
import { useUserData } from '../hooks/useApi';
import { layoutStyles } from '../shared/context/DesignSystem';

// Components
import ProfilePage from '../domains/user/components/ProfilePage';
import PackageDetails from '../domains/package/components/PackageDetails';
import TripPackagesScreen from '../domains/delivery/components/TripPackagesScreen';
import CourierContactScreen from '../domains/delivery/components/CourierContactScreen';

const ProfilePageContainer = () => {
  const { 
    selectedPackage,
    selectedTrip,
    selectedCourierForContact,
    selectPackage,
    selectTrip,
    navigateTo
  } = useAppContext();
  
  const { 
    packages: myPackages, 
    trips: userTrips, 
    loading: userDataLoading 
  } = useUserData();
  
  if (userDataLoading) {
    return (
      <div style={{
        ...layoutStyles.page,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--tg-theme-hint-color, #708499)',
          fontSize: 16
        }}>
          Загрузка...
        </div>
      </div>
    );
  }
  
  // Show courier contact screen if selected
  if (selectedCourierForContact) {
    return (
      <CourierContactScreen 
        courier={selectedCourierForContact.courier}
        packageData={selectedCourierForContact.package}
        onBack={() => {
          // Reset selection - this should be handled by AppContext
          navigateTo('profile');
        }}
      />
    );
  }
  
  // Show trip packages screen if trip is selected
  if (selectedTrip) {
    return (
      <TripPackagesScreen 
        trip={selectedTrip}
        onBack={() => {
          selectTrip(null);
        }}
      />
    );
  }
  
  // Show package details if package is selected
  if (selectedPackage) {
    return (
      <PackageDetails 
        packageData={selectedPackage}
        setSelectedPackage={selectPackage}
        onSelectCourier={() => {
          // This should set selectedCourierForContact in AppContext
          // For now, just navigate back
          selectPackage(null);
        }}
      />
    );
  }
  
  // Show main profile page
  return (
    <ProfilePage 
      setShowProfilePage={() => navigateTo('search')}
      myPackages={myPackages}
      userTrips={userTrips}
      setSelectedPackage={selectPackage}
      setSelectedTrip={selectTrip}
    />
  );
};

export default ProfilePageContainer;