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
    console.warn('⚠️ VITE_API_BASE_URL is missing in Vercel Environment Variables! Requests may fail.');
    return '';
  }
  return window.location.origin.replace('5173', '5000');
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = API_BASE_URL || window.location.origin;

