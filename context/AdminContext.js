'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [adminDetails, setAdminDetails] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Initialize admin session on mount
  useEffect(() => {
    const initializeAdmin = async () => {
      const storedToken = localStorage.getItem('admin_token');
      const storedAdmin = localStorage.getItem('admin_user');

      if (storedToken && storedAdmin) {
        try {
          // Set initial state from localStorage
          setToken(storedToken);
          setAdmin(JSON.parse(storedAdmin));

          // Fetch fresh data from API
          const [profileRes, adminRes] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get_by_id/1`)
          ]);

          const profile = profileRes.data;
          if (profile.role !== 'admin') {
            throw new Error('Access denied. Admins only.');
          }

          // Update state with fresh data
          setAdmin(profile);
          setAdminDetails(adminRes.data);
          localStorage.setItem('admin_user', JSON.stringify(profile));
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAdmin();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // First perform the login to get the token
      const loginRes = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { access_token } = loginRes.data;

      // Then fetch the profile with the new token
      const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const profile = profileRes.data;
      if (profile.role !== 'admin') {
        throw new Error('Access denied. Admins only.');
      }

      // Fetch admin details
      const adminRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get_by_id/1`);

      // Update all state and storage
      setAdmin(profile);
      setAdminDetails(adminRes.data);
      setToken(access_token);
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_user', JSON.stringify(profile));

      toast.success('Login successful');
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsLoggingOut(true);
    setAdmin(null);
    setAdminDetails(null);
    setToken('');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully');
    router.push('/admin');
    setTimeout(() => setIsLoggingOut(false), 1000);
  };

  const updateAdminProfile = (updatedProfile) => {
    setAdmin(updatedProfile);
    localStorage.setItem('admin_user', JSON.stringify(updatedProfile));
  };

  const updateAdminDetails = (updatedDetails) => {
    setAdminDetails(updatedDetails);
  };

  const isAdminAuthenticated = !!admin && !!token;

  return (
    <AdminContext.Provider value={{
      admin,
      adminDetails,
      token,
      loading,
      login,
      logout,
      isAdminAuthenticated,
      isLoggingOut,
      updateAdminProfile,
      updateAdminDetails
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);




