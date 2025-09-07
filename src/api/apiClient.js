// apiclient.js
const BASE_URL = 'https://greengrass-backend.onrender.com';

class ApiClient {
  constructor() {
    this.baseURL = BASE_URL;
    this.token = this.getStoredToken();
  }

  // Get token from localStorage
  getStoredToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  // Set token in localStorage and instance
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
    this.token = token;
  }

  // Remove token from localStorage and instance
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    this.token = null;
  }

  // Get refresh token
  getRefreshToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  // Set refresh token
  setRefreshToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  // Create request headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.auth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials) {
    return this.request('/api/accounts/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
      auth: false,
    });
  }

  async register(userData) {
    return this.request('/api/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
      auth: false,
    });
  }

  async getTokens(credentials) {
    return this.request('/api/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
      auth: false,
    });
  }

  // User profile endpoints
  async getProfile() {
    return this.request('/api/accounts/profile/');
  }

  async getUserProfile(username) {
    return this.request(`/api/accounts/profile/${username}/`);
  }

  // Properties endpoints
  async getProperties() {
    return this.request('/api/rooms/properties/', { auth: false });
  }

  async getProperty(id) {
    return this.request(`/api/rooms/properties/${id}/`, { auth: false });
  }

  async createProperty(propertyData) {
    return this.request('/api/rooms/properties/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  // Favorites endpoints
  async getFavorites() {
    return this.request('/api/rooms/favorites/');
  }

  async addToFavorites(propertyData) {
    return this.request('/api/rooms/favorites/', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async removeFromFavorites(propertyId) {
    return this.request(`/api/rooms/favorites/${propertyId}/`, {
      method: 'DELETE',
    });
  }

  // Reviews endpoints
  async getPropertyReviews(propertyId) {
    return this.request(`/api/rooms/properties/${propertyId}/reviews/`, { auth: false });
  }

  async createPropertyReview(propertyId, reviewData) {
    return this.request(`/api/rooms/properties/${propertyId}/reviews/`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Messaging endpoints
  async getConversations() {
    return this.request('/api/messaging/conversations/');
  }

  async startConversation(conversationData) {
    return this.request('/api/messaging/start-conversation/', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    });
  }

  // Landlords endpoint
  async getLandlords() {
    return this.request('/api/accounts/landlords/', { auth: false });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;