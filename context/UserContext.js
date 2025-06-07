"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const API_BASE_URL = 'http://127.0.0.1:8000';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('access_token');
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const saveToken = (accessToken) => {
    localStorage.setItem('access_token', accessToken);
    setToken(accessToken);
  };

  const clearToken = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      saveToken(res.data.access_token);
      await fetchProfile(res.data.access_token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.detail || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (accessToken = token) => {
    if (!accessToken || accessToken === "null" || accessToken === "undefined") {
      clearToken(); // logout if token is unusable
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch profile:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401) {
        clearToken(); // Only clear token on 401
      }
    }
  };

  const logout = () => {
    clearToken();
  };

  useEffect(() => {
    if (token) fetchProfile(token);
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, loading, register, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
