// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(() => localStorage.getItem('access'));
  const [refresh, setRefresh] = useState(() => localStorage.getItem('refresh'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (access) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      fetchUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
    }
  }, [access, refresh]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/auth/user/');
      setUser(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch user:', err);
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login/', {
        username,
        password,
      });
      const { access, refresh } = res.data;
      setAccess(access);
      setRefresh(refresh);
      return res;
    } catch (err) {
      console.error('❌ Login failed:', err);
      throw err;
    }
  };

  const logout = () => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
  };

  const value = {
    access,
    refresh,
    user,
    login,
    logout,
    isAuthenticated: !!access,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook for accessing AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
