import { ProfileData } from "@/types/auth";
import { Dayjs } from "dayjs";

// API base URL configuration from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3001/api";

/**
 * Extended request options interface
 * Extends the standard RequestInit with typed headers
 */
interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Standardized API response interface
 * Provides consistent structure for all API responses
 */
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

/**
 * User profile data interface
 * Used for updating coach/user profile information
 */

/**
 * Token getter function type
 * Function that returns an authentication token for API requests
 */
type TokenGetter = () => Promise<string | undefined>;

class ApiService {
  private getAccessToken: TokenGetter | null = null;

  constructor() {
    this.getAccessToken = null; // Will be set by Auth0 context
  }

  // Set the Auth0 token getter function
  setTokenGetter(getAccessTokenFn: TokenGetter): void {
    this.getAccessToken = getAccessTokenFn;
  }

  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestOptions = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Get Auth0 token if available
    if (this.getAccessToken) {
      try {
        const token = await this.getAccessToken();
        if (token) {
          config.headers!.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn("Failed to get Auth0 token:", error);
      }
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // #region Auth methods
  async getCoachProfile(): Promise<ApiResponse> {
    return await this.request("/auth/profile");
  }

  async createCoachProfile(profileData: ProfileData): Promise<ApiResponse> {
    return await this.request("/auth/profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    });
  }

  async updateCoachProfile(
    profileData: Partial<ProfileData>
  ): Promise<ApiResponse> {
    return await this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }
  // #endregion

  // #region Player methods
  async getPlayersByCoachId(coachId: number): Promise<ApiResponse> {
    return await this.request(`/players?coachId=${coachId}`);
  }

  async addPlayer(playerData: {
    firstName: string;
    lastName: string;
    dob: Dayjs;
    coachId: number;
  }): Promise<ApiResponse> {
    return await this.request("/players", {
      method: "POST",
      body: JSON.stringify(playerData),
    });
  }
  // #endregion

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch("http://localhost:3001/health");
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
