const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.getAccessToken = null; // Will be set by Auth0 context
  }

  // Set the Auth0 token getter function
  setTokenGetter(getAccessTokenFn) {
    this.getAccessToken = getAccessTokenFn;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
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
          config.headers.Authorization = `Bearer ${token}`;
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
  async getCoachProfile() {
    return await this.request('/auth/profile');
  }

  async createCoachProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updateCoachProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Player methods
  async getPlayers() {
    return await this.request('/players');
  }

  async getPlayer(id) {
    return await this.request(`/players/${id}`);
  }

  async createPlayer(playerData) {
    return await this.request('/players', {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  }

  async updatePlayer(id, playerData) {
    return await this.request(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(playerData),
    });
  }

  async deletePlayer(id) {
    return await this.request(`/players/${id}`, {
      method: 'DELETE',
    });
  }

  // Assessment methods
  async getAssessmentTypes() {
    return await this.request('/assessments/types');
  }

  async getAssessmentCategories() {
    return await this.request('/assessments/categories');
  }

  async getPlayerAssessments(playerId) {
    return await this.request(`/assessments/player/${playerId}`);
  }

  async saveAssessmentResult(resultData) {
    return await this.request('/assessments/result', {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  }

  async updateAssessmentResult(id, resultData) {
    return await this.request(`/assessments/result/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resultData),
    });
  }

  async deleteAssessmentResult(id) {
    return await this.request(`/assessments/result/${id}`, {
      method: 'DELETE',
    });
  }

  // Assessment types management
  async createAssessmentType(typeData) {
    return await this.request('/assessments/types', {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  }

  async updateAssessmentType(id, typeData) {
    return await this.request(`/assessments/types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(typeData),
    });
  }

  async deleteAssessmentType(id) {
    return await this.request(`/assessments/types/${id}`, {
      method: 'DELETE',
    });
  }

  // Goals methods
  async getGoals() {
    return await this.request('/goals');
  }

  async getPlayerGoals(playerId) {
    return await this.request(`/goals/player/${playerId}`);
  }

  async createGoal(goalData) {
    return await this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async updateGoal(id, goalData) {
    return await this.request(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  }

  async deleteGoal(id) {
    return await this.request(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Health check
  async healthCheck() {
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
