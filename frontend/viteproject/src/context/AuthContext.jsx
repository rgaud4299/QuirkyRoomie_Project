import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: check localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);

        // Optional: set auth header globally if token present
        if (parsed?.token) {
          API.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Invalid user data in localStorage:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const userData = res.data;

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      if (userData.token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      }

      return userData;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (name, email, password, flatCode) => {
    try {
      const res = await API.post('/auth/register', { name, email, password, flatCode });
      const userData = res.data;

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      if (userData.token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      }

      return userData;
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete API.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
