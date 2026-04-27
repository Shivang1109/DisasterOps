const BASE_URL = import.meta.env.VITE_API_URL || 'http://DisasterOps-env.ebs-ffq37ztk-ap-south-1.elasticbeanstalk.com';

export const API_URL = `${BASE_URL}/api/incidents`;
export const AUTH_URL = `${BASE_URL}/api/auth`;
export const SOCKET_URL = BASE_URL;
