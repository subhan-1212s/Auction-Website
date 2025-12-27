import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Axios Interceptor for Persistent Tokens
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    // Initial Session Restore
    const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      axios.get('/api/auth/me')
        .then(res => {
          if (res.data.success) {
            const userData = res.data.data;
            const isProfileComplete = !!(userData.phone && userData.addresses && userData.addresses.length > 0);
            setUser({ ...userData, needsProfileUpdate: !isProfileComplete });
            console.log('✅ Session Restored:', res.data.data.email);
          }
        })
        .catch((err) => {
          console.error('❌ Session Restore Failed:', err.response?.data || err.message);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });

    // Check for OTP requirement
    if (res.data.requireOtp) {
      return { requireOtp: true, email: res.data.email };
    }

    if (res.data.success) {
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    }
  };

  const verifyOtp = async (email, otp) => {
    const res = await axios.post('/api/auth/verify-otp', { email, otp });
    if (res.data.success) {
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    }
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    return res.data;
  };

  const updateProfile = async (profileData) => {
    const res = await axios.put('/api/auth/profile', profileData);
    if (res.data.success) {
      const userData = res.data.data;
      const isProfileComplete = !!(userData.phone && userData.addresses && userData.addresses.length > 0);
      const updatedUser = { ...userData, needsProfileUpdate: !isProfileComplete };
      setUser(updatedUser);
      return updatedUser;
    }
  };

  const toggleWatchlist = async (productId) => {
    const res = await axios.post(`/api/auth/watchlist/${productId}`);
    if (res.data.success) {
      // Re-fetch 'me' to get populated watchlist or just update user locally
      const meRes = await axios.get('/api/auth/me');
      setUser(meRes.data.data);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const requestSellerRole = async () => {
    const res = await axios.post('/api/seller-requests')
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
      return res.data.user;
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      toggleWatchlist,
      verifyOtp,
      requestSellerRole
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
