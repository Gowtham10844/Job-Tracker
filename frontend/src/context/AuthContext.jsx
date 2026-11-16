// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('jobtrack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('jobtrack_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token and verify user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('jobtrack_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('jobtrack_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid token:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for global 401 unauthorized events
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('jobtrack_token', data.token);
      localStorage.setItem('jobtrack_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async userData => {
    const data = await authService.register(userData);
    if (data.success && data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('jobtrack_token', data.token);
      localStorage.setItem('jobtrack_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jobtrack_token');
    localStorage.removeItem('jobtrack_user');
  };

  const updateUser = updatedUserData => {
    setUser(prev => {
      const merged = { ...prev, ...updatedUserData };
      localStorage.setItem('jobtrack_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
