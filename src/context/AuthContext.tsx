import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import apiService from "../services/apiService.js";

// Interface for user profile from our backend
interface UserProfile {
  id: number;
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  createdAt: string;
  updatedAt: string;
  roles?: string[];
}

// Interface for Auth context value
interface AuthContextType {
  // Auth0 values
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | undefined;

  // Our custom values
  userProfile: UserProfile | null;

  // Methods
  login: () => void;
  logout: () => void;
  getAccessTokenSilently: () => Promise<string>;

  // Helper methods
  hasRole: (role: string) => boolean;
  isCoach: () => boolean;
}

// Interface for provider props
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
    error,
  } = useAuth0();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Update API service with Auth0 token getter when user is authenticated
  useEffect(() => {
    const updateApiToken = async (): Promise<void> => {
      if (isAuthenticated) {
        // Set the Auth0 token getter function in apiService
        apiService.setTokenGetter(getAccessTokenSilently);
      } else {
        // Clear the token getter when not authenticated
        apiService.setTokenGetter(() => Promise.resolve(undefined));
      }
      setAuthLoading(false);
    };

    if (!isLoading) {
      updateApiToken();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  // Load user profile from our backend when authenticated
  useEffect(() => {
    const loadUserProfile = async (): Promise<void> => {
      if (isAuthenticated && user && !authLoading) {
        try {
          // Check if user exists in our backend
          const profile = await apiService.getCoachProfile();
          setUserProfile(profile.data);
        } catch (error: any) {
          // User might not exist in our backend yet
          if (
            error.message.includes("404") ||
            error.message.includes("not found")
          ) {
            // Create user profile in our backend
            try {
              const newProfile = await apiService.createCoachProfile({
                auth0Id: user.sub,
                email: user.email || "",
                firstName:
                  user.given_name || user.name?.split(" ")[0] || "Coach",
                lastName: user.family_name || user.name?.split(" ")[1] || "",
                picture: user.picture,
              });
              setUserProfile(newProfile.data);
            } catch (createError) {
              console.error("Error creating user profile:", createError);
            }
          } else {
            console.error("Error loading user profile:", error);
          }
        }
      }
    };

    if (isAuthenticated && !authLoading) {
      loadUserProfile();
    }
  }, [isAuthenticated, user, authLoading]);

  const login = (): void => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    });
  };

  const logout = (): void => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    setUserProfile(null);
  };

  const hasRole = (role: string): boolean => {
    return userProfile?.roles?.includes(role) || false;
  };

  const isCoach = (): boolean => {
    return isAuthenticated && !!userProfile;
  };

  const contextValue: AuthContextType = {
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
    hasRole,
    isCoach,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
