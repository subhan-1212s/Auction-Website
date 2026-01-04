import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Immediate UI hydration from cache
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  })
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
        // Only logout on explicit authentication failures (401/403)
        // This prevents accidental logouts during network timeouts or server 500s
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn('⚠️ Authentication error, logging out...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
          const userData = res.data.data;
          const isProfileComplete = !!(userData.phone && userData.addresses && userData.addresses.length > 0);
          const fullUser = { ...userData, needsProfileUpdate: !isProfileComplete };

          setUser(fullUser);
          localStorage.setItem('user', JSON.stringify(fullUser)); // Cache for next reload
          console.log('✅ Session Restored:', userData.email);
        }
      } catch (err) {
        console.error('❌ Session Restore Failed:', err.response?.data || err.message);
        // Only clear if it's a "bad token" error. If it's a network error, keep the cached user.
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

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
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
  };

  const verifyOtp = async (email, otp) => {
    const res = await axios.post('/api/auth/verify-otp', { email, otp });
    if (res.data.success) {
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
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
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    }
  };

  const toggleWatchlist = async (productId) => {
    const res = await axios.post(`/api/auth/watchlist/${productId}`);
    if (res.data.success) {
      // Re-fetch 'me' to get populated watchlist or just update user locally
      const meRes = await axios.get('/api/auth/me');
      const userData = meRes.data.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const requestSellerRole = async () => {
    const res = await axios.post('/api/seller-requests')
    return res.data;
  }

  const skipProfile = async () => {
    const res = await axios.post('/api/auth/profile/mark-prompt-seen');
    if (res.data.success) {
      const userData = res.data.data;
      // Fetch fresh user data to ensure all flags are correct
      const meRes = await axios.get('/api/auth/me');
      const freshUser = meRes.data.data;
      localStorage.setItem('user', JSON.stringify(freshUser));
      setUser(freshUser);
      return freshUser;
    }
  };

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
      requestSellerRole,
      skipProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
