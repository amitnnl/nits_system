import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Enable sharing session cookies with the backend
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Calls our session checking endpoint
      const response = await axios.get('/api/auth/check.php');
      const resData = response.data;
      
      if (resData.status === 'success' && resData.data.authenticated) {
        setUser(resData.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session verification failed', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login.php', { email, password });
      const resData = response.data;
      if (resData.status === 'success') {
        setUser(resData.data);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: resData.message || 'Login failed' };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Server error. Please try again.';
      return { success: false, error: msg };
    }
  };

  const adminLogin = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/admin-login.php', { username, password });
      const resData = response.data;
      if (resData.status === 'success') {
        setUser(resData.data);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: resData.message || 'Admin login failed' };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Server error. Please try again.';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout.php');
    } catch (error) {
      console.error('Logout request failed', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, adminLogin, logout, refreshAuth: checkAuth }}>
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
