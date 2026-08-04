import { createContext, useCallback, useEffect, useState } from 'react';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('mn_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.me();
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('mn_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const persistSession = (data) => {
    if (data.token) localStorage.setItem('mn_token', data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    persistSession(res);
    return res;
  };

  const login = async (payload) => {
    const res = await authService.login(payload);
    persistSession(res);
    return res;
  };

  const loginWithGoogle = async (credential) => {
    const res = await authService.loginWithGoogle(credential);
    persistSession(res);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore network errors on logout
    }
    localStorage.removeItem('mn_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authService.me();
      setUser(res.data);
    } catch (err) {
      // ignore
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    refreshUser,
    setUser,
    getErrorMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
