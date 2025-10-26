import { API_CONFIG } from './api-config';

// Extended API configuration
export const EXTENDED_API_CONFIG = {
  ...API_CONFIG,
  endpoints: {
    ...API_CONFIG.endpoints,
    linkInstagram: '/api/social/link-instagram',
    linkLinkedin: '/api/social/link-linkedin',
  },
};