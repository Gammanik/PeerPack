import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseApi } from '../../services/supabaseApi';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initUser();
  }, []);

  const initUser = async () => {
    try {
      setLoading(true);

      // Получаем данные пользователя из Telegram WebApp
      const tg = window.Telegram?.WebApp;

      if (tg?.initDataUnsafe?.user) {
        // Prod: используем реального пользователя из Telegram
        const telegramUser = tg.initDataUnsafe.user;
        const { user: dbUser, error } = await supabaseApi.getOrCreateUser(telegramUser);

        if (error) {
          console.error('Error getting user from DB:', error);
          setError(error.message);
        } else {
          setUser(dbUser);
        }
      } else {
        // Dev: используем мок пользователя для локальной разработки
        console.log('⚠️ Telegram WebApp not found, using mock user for development');
        const mockUser = {
          id: 1,
          telegram_id: 123456789,
          telegram_username: 'nikita_user',
          full_name: 'Никита Иванов',
          avatar_url: 'https://i.pravatar.cc/100?img=50',
          rating: 5.0
        };
        setUser(mockUser);
      }
    } catch (err) {
      console.error('Error initializing user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refreshUser: initUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export default UserContext;
