import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('sprintflow_token');
    const storedUser = localStorage.getItem('sprintflow_user');

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('sprintflow_user');
      }
    }

    if (!token || token === 'undefined' || token === 'null') {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.getMe();
      if (res.data && res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('sprintflow_user', JSON.stringify(res.data.user));
      } else {
        localStorage.removeItem('sprintflow_token');
        localStorage.removeItem('sprintflow_user');
        setUser(null);
      }
    } catch (err) {
      console.warn('[Session Verification Notice] Invalid or expired token.');
      if (!storedUser) {
        localStorage.removeItem('sprintflow_token');
        localStorage.removeItem('sprintflow_user');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.data && res.data.success && res.data.token) {
        localStorage.setItem('sprintflow_token', res.data.token);
        localStorage.setItem('sprintflow_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true };
      }
      return { 
        success: false, 
        message: res.data?.message || 'Invalid email or password.' 
      };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password.';
      return { success: false, message: errMsg };
    }
  };

  const register = async (name, email, password, companyName) => {
    try {
      const res = await authAPI.register({ name, email, password, companyName });
      if (res.data && res.data.success && res.data.token) {
        localStorage.setItem('sprintflow_token', res.data.token);
        localStorage.setItem('sprintflow_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return { success: true };
      }
      return { 
        success: false, 
        message: res.data?.message || 'An account with this email already exists. Please sign in.' 
      };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'An account with this email already exists. Please sign in.';
      return { success: false, message: errMsg };
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const res = await authAPI.updateProfile(profileData);
      if (res.data && res.data.success && res.data.user) {
        const updated = res.data.user;
        if (res.data.token) {
          localStorage.setItem('sprintflow_token', res.data.token);
        }
        localStorage.setItem('sprintflow_user', JSON.stringify(updated));
        setUser(updated);
        return { success: true, message: res.data.message || 'Profile updated successfully' };
      }
      return { success: false, message: res.data?.message || 'Failed to update profile' };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('sprintflow_token');
    localStorage.removeItem('sprintflow_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
