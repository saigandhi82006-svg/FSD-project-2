import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('alumni_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth on page load / refresh
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('alumni_token');
        if (token) {
          const res = await api.get('/auth/me');
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('alumni_user', JSON.stringify(res.data.user));
          }
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        localStorage.removeItem('alumni_token');
        localStorage.removeItem('alumni_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      const loggedUser = res.data.user;
      const token = res.token;
      setUser(loggedUser);
      localStorage.setItem('alumni_token', token);
      localStorage.setItem('alumni_user', JSON.stringify(loggedUser));
      return loggedUser;
    }
    throw new Error(res.error || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.success) {
      const newUser = res.data.user;
      const token = res.token;
      setUser(newUser);
      localStorage.setItem('alumni_token', token);
      localStorage.setItem('alumni_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.error || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API call failed:', err.message);
    } finally {
      localStorage.removeItem('alumni_token');
      localStorage.removeItem('alumni_user');
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('alumni_user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        updateUser(res.data.user);
      }
    } catch (err) {
      console.warn('Could not refresh user:', err.message);
    }
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
