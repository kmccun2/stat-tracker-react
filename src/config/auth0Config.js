// Auth0 Configuration
// Replace these values with your actual Auth0 domain and client ID
// You can get these from your Auth0 Dashboard

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || "your-domain.us.auth0.com",
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id",
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || "https://stat-tracker-api",
  redirectUri: window.location.origin,
  scope: "openid profile email",
  useRefreshTokens: true,
  cacheLocation: "localstorage"
};

export default auth0Config;

// Environment variables to add to your .env file:
// REACT_APP_AUTH0_DOMAIN=your-domain.us.auth0.com
// REACT_APP_AUTH0_CLIENT_ID=your-client-id
// REACT_APP_AUTH0_AUDIENCE=https://stat-tracker-api
