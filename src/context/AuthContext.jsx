import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
    error
  } = useAuth0();

  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Update API service with token when user is authenticated
  useEffect(() => {
    const updateApiToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          apiService.token = token;
          localStorage.setItem('authToken', token);
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      } else {
        apiService.token = null;
        localStorage.removeItem('authToken');
      }
      setAuthLoading(false);
    };

    if (!isLoading) {
      updateApiToken();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  // Load user profile from our backend when authenticated
  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated && user && apiService.token) {
        try {
          // Check if user exists in our backend
          const profile = await apiService.getCoachProfile();
          setUserProfile(profile.data);
        } catch (error) {
          // User might not exist in our backend yet
          if (error.message.includes('404') || error.message.includes('not found')) {
            // Create user profile in our backend
            try {
              const newProfile = await apiService.createCoachProfile({
                auth0Id: user.sub,
                email: user.email,
                firstName: user.given_name || user.name?.split(' ')[0] || 'Coach',
                lastName: user.family_name || user.name?.split(' ')[1] || '',
                picture: user.picture
              });
              setUserProfile(newProfile.data);
            } catch (createError) {
              console.error('Error creating user profile:', createError);
            }
          } else {
            console.error('Error loading user profile:', error);
          }
        }
      }
    };

    if (isAuthenticated && !authLoading) {
      loadUserProfile();
    }
  }, [isAuthenticated, user, authLoading]);

  const login = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    setUserProfile(null);
  };

  const contextValue = {
    // Auth0 values
    user,
    isAuthenticated,
    isLoading: isLoading || authLoading,
    error,
    
    // Our custom values
    userProfile,
    
    // Methods
    login,
    logout,
    getAccessTokenSilently,
    
    // Helper methods
    hasRole: (role) => {
      return userProfile?.roles?.includes(role) || false;
    },
    
    isCoach: () => {
      return isAuthenticated && userProfile;
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
