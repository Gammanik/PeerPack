import React, { createContext, useContext, useReducer } from 'react';

// Navigation actions
const NAVIGATION_ACTIONS = {
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  SET_SELECTED_COURIER: 'SET_SELECTED_COURIER',
  SET_SELECTED_PACKAGE: 'SET_SELECTED_PACKAGE',
  SET_SELECTED_TRIP: 'SET_SELECTED_TRIP'
};

// App state actions
const APP_ACTIONS = {
  SET_SEARCH_COLLAPSED: 'SET_SEARCH_COLLAPSED',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

const initialState = {
  // Navigation state
  currentPage: 'search', // 'search', 'profile', 'about', 'notifications'
  modal: {
    isOpen: false,
    type: null, // 'courier', 'request-form', 'add-trip'
    data: null
  },
  selectedCourier: null,
  selectedPackage: null,
  selectedTrip: null,
  selectedCourierForContact: null,
  
  // App state
  searchCollapsed: false,
  loading: false,
  error: null
};

function appReducer(state, action) {
  switch (action.type) {
    // Navigation actions
    case NAVIGATION_ACTIONS.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
        // Reset selections when navigating
        selectedCourier: null,
        selectedPackage: null,
        selectedTrip: null,
        selectedCourierForContact: null
      };
      
    case NAVIGATION_ACTIONS.OPEN_MODAL:
      return {
        ...state,
        modal: {
          isOpen: true,
          type: action.payload.type,
          data: action.payload.data || null
        }
      };
      
    case NAVIGATION_ACTIONS.CLOSE_MODAL:
      return {
        ...state,
        modal: {
          isOpen: false,
          type: null,
          data: null
        }
      };
      
    case NAVIGATION_ACTIONS.SET_SELECTED_COURIER:
      return { ...state, selectedCourier: action.payload };
      
    case NAVIGATION_ACTIONS.SET_SELECTED_PACKAGE:
      return { ...state, selectedPackage: action.payload };
      
    case NAVIGATION_ACTIONS.SET_SELECTED_TRIP:
      return { ...state, selectedTrip: action.payload };
      
    // App state actions
    case APP_ACTIONS.SET_SEARCH_COLLAPSED:
      return { ...state, searchCollapsed: action.payload };
      
    case APP_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case APP_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
      
    case APP_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
      
    default:
      return state;
  }
}

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Navigation actions
  const navigateTo = (page) => {
    dispatch({ type: NAVIGATION_ACTIONS.SET_CURRENT_PAGE, payload: page });
  };
  
  const openModal = (type, data = null) => {
    dispatch({ type: NAVIGATION_ACTIONS.OPEN_MODAL, payload: { type, data } });
  };
  
  const closeModal = () => {
    dispatch({ type: NAVIGATION_ACTIONS.CLOSE_MODAL });
  };
  
  const selectCourier = (courier) => {
    dispatch({ type: NAVIGATION_ACTIONS.SET_SELECTED_COURIER, payload: courier });
    openModal('courier', courier);
  };
  
  const selectPackage = (packageData) => {
    dispatch({ type: NAVIGATION_ACTIONS.SET_SELECTED_PACKAGE, payload: packageData });
  };
  
  const selectTrip = (trip) => {
    dispatch({ type: NAVIGATION_ACTIONS.SET_SELECTED_TRIP, payload: trip });
  };
  
  // App state actions
  const setSearchCollapsed = (collapsed) => {
    dispatch({ type: APP_ACTIONS.SET_SEARCH_COLLAPSED, payload: collapsed });
  };
  
  const setLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
  };
  
  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
  };
  
  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };
  
  const value = {
    // State
    ...state,
    
    // Actions
    navigateTo,
    openModal,
    closeModal,
    selectCourier,
    selectPackage,
    selectTrip,
    setSearchCollapsed,
    setLoading,
    setError,
    clearError
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export { NAVIGATION_ACTIONS, APP_ACTIONS };