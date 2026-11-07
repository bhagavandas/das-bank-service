import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [token, setToken] = useState(authService.getToken());
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [loading, setLoading] = useState(false);

  // Ping backend gateway health check
  const checkBackend = async () => {
    try {
      const res = await authService.checkHealth();
      if (res && res.status === 'UP') {
        setBackendStatus('online');
      } else {
        setBackendStatus('online'); // even if basic status returned
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  // Listen for unauthorized 401 events from Axios
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('bank:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('bank:unauthorized', handleUnauthorized);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      setUser(data.username || username);
      setToken(data.token);
      setBackendStatus('online');
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.register(username, password);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        backendStatus,
        loading,
        login,
        register,
        logout,
        checkBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

