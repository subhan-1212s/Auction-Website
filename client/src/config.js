// Production/Development API and Socket Configuration
const isProduction = import.meta.env.PROD;

// When deploying: 
// - Set VITE_API_BASE_URL in your Vercel Environment Variables to your backend URL (e.g., https://your-backend.onrender.com)
// - In local dev, defaults to replacing 5173 with 5000
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (isProduction) {
    console.warn('⚠️ VITE_API_BASE_URL is missing in Vercel Environment Variables!');
    return '';
  }
  // In local development, reliably connect to backend on port 5000
  const hostname = window.location.hostname || 'localhost';
  const protocol = window.location.protocol || 'http:';
  return `${protocol}//${hostname}:5000`;
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = API_BASE_URL || window.location.origin;

export const getImageUrl = (url) => {
  const fallback = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400';
  if (!url || typeof url !== 'string') return fallback;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

