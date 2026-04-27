const BASE_URL = import.meta.env.VITE_API_URL || 'https://disasterops.onrender.com';

export const API_URL = `${BASE_URL}/api/incidents`;
export const AUTH_URL = `${BASE_URL}/api/auth`;
export const SOCKET_URL = BASE_URL;
