// Auth0 Configuration
// Replace these values with your actual Auth0 domain and client ID
// You can get these from your Auth0 Dashboard

import type { Auth0Config } from '../types';

const auth0Config: Auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || "your-domain.us.auth0.com",
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id",
  audience: import.meta.env.VITE_AUTH0_AUDIENCE, // Optional - will be undefined if not set
  redirectUri: window.location.origin,
  scope: "openid profile email",
  useRefreshTokens: true,
  cacheLocation: "localstorage" as const
};

export default auth0Config;

// Environment variables to add to your .env file:
// VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
// VITE_AUTH0_CLIENT_ID=your-client-id
// VITE_AUTH0_AUDIENCE=https://stat-tracker-api
