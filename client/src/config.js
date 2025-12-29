// Production/Development API and Socket Configuration
const isProduction = import.meta.env.PROD;

// When deploying: 
// - Change the production URL to your Render/Backend URL
// - The dev URL handles the Vite (5173) to Express (5000) port swap
export const API_BASE_URL = isProduction 
  ? (import.meta.env.VITE_API_BASE_URL || 'https://your-production-backend-url.com')
  : window.location.origin.replace('5173', '5000');

export const SOCKET_URL = API_BASE_URL;
