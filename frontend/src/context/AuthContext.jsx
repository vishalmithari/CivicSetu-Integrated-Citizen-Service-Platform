import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      return res.data;
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await fetchProfile();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.accessToken;
    localStorage.setItem('token', token);
    return await fetchProfile();
  };

  const register = async (userData) => {
    await api.post('/auth/register', userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
