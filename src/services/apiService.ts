// API base URL configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
 * Player data interface for API operations
 * Used for creating and updating player records
 */
interface PlayerData {
  name: string;
  gender: 'M' | 'F';
  dob: number; // Excel serial date number
}

/**
 * Assessment result data interface
 * Used for recording player assessment scores
 */
interface AssessmentResultData {
  playerId: number;
  metric: string;
  resultValue: number;
  assessmentDate?: string;
  notes?: string;
}

/**
 * Goal data interface for creating performance goals
 * Supports both target and range-based goals with age/gender filtering
 */
interface GoalData {
  metric: string;
  unit: string;
  ageMin: number;
  ageMax: number;
  gender: 'M' | 'F';
  lowIsGood: boolean;
  isRangeGoal: boolean;
  scoreLowEnd?: number;
  scoreHighEnd?: number;
  scoreAverage?: number;
}

/**
 * User profile data interface
 * Used for updating coach/user profile information
 */
interface ProfileData {
  auth0Id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

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

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestOptions = {
      headers: {
        'Content-Type': 'application/json',
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
        console.warn('Failed to get Auth0 token:', error);
      }
    }

    try {
      console.log(url, config);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods (Auth0 integration)
  async getCoachProfile(): Promise<ApiResponse> {
    return await this.request('/auth/profile');
  }

  async createCoachProfile(profileData: ProfileData): Promise<ApiResponse> {
    return await this.request('/auth/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updateCoachProfile(profileData: Partial<ProfileData>): Promise<ApiResponse> {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Player methods
  async getPlayers(): Promise<ApiResponse> {
    return await this.request('/players');
  }

  async getPlayer(id: string | number): Promise<ApiResponse> {
    return await this.request(`/players/${id}`);
  }

  async createPlayer(playerData: PlayerData): Promise<ApiResponse> {
    return await this.request('/players', {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  }

  async updatePlayer(id: string | number, playerData: Partial<PlayerData>): Promise<ApiResponse> {
    return await this.request(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(playerData),
    });
  }

  async deletePlayer(id: string | number): Promise<ApiResponse> {
    return await this.request(`/players/${id}`, {
      method: 'DELETE',
    });
  }

  // Assessment methods
  async getAssessments(timeframe: string = 'all'): Promise<ApiResponse> {
    const params = timeframe !== 'all' ? `?timeframe=${timeframe}` : '';
    return await this.request(`/assessments${params}`);
  }

  async getMetrics(): Promise<ApiResponse> {
    return await this.request('/metrics');
  }

  async getAssessmentCategories(): Promise<ApiResponse> {
    return await this.request('/metrics/categories');
  }

  async getPlayerAssessments(playerId: string | number): Promise<ApiResponse> {
    return await this.request(`/assessments/player/${playerId}`);
  }

  async saveAssessmentResult(resultData: AssessmentResultData): Promise<ApiResponse> {
    return await this.request('/assessments/result', {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  }

  async updateAssessmentResult(id: string | number, resultData: Partial<AssessmentResultData>): Promise<ApiResponse> {
    return await this.request(`/assessments/result/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resultData),
    });
  }

  async deleteAssessmentResult(id: string | number): Promise<ApiResponse> {
    return await this.request(`/assessments/result/${id}`, {
      method: 'DELETE',
    });
  }

  // Metrics management
  async createMetric(typeData: any): Promise<ApiResponse> {
    return await this.request('/metrics', {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  }

  async updateMetric(id: string | number, typeData: any): Promise<ApiResponse> {
    return await this.request(`/metrics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(typeData),
    });
  }

  async deleteMetric(id: string | number): Promise<ApiResponse> {
    return await this.request(`/metrics/${id}`, {
      method: 'DELETE',
    });
  }

  // Goals methods
  async getGoals(): Promise<ApiResponse> {
    return await this.request('/goals');
  }

  async getPlayerGoals(playerId: string | number): Promise<ApiResponse> {
    return await this.request(`/goals/player/${playerId}`);
  }

  async createGoal(goalData: GoalData): Promise<ApiResponse> {
    return await this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async updateGoal(id: string | number, goalData: Partial<GoalData>): Promise<ApiResponse> {
    return await this.request(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  }

  async deleteGoal(id: string | number): Promise<ApiResponse> {
    return await this.request(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/health');
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
