import { useState, useEffect } from 'react';
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};

export const useAuthGuard = (navigation) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigation.navigate('Auth', { screen: 'Login' });
    }
  }, [isAuthenticated, loading, navigation]);

  return { isAuthenticated, loading };
};