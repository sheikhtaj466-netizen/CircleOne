import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['x-auth-token'] = token;
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);
  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);
  if (loading) return null;
  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};
