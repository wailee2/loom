const BASE_URL = 'https://greengrass-backend.onrender.com';

class ApiClient {
  constructor() {
    this.baseURL = BASE_URL;
    this.token = this.getStoredToken();
  }

  // --------------------
  // Token Utilities
  // --------------------
  getStoredToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') localStorage.setItem('access_token', token);
    this.token = token;
  }

  getRefreshToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
  }

  setRefreshToken(token) {
    if (typeof window !== 'undefined') localStorage.setItem('refresh_token', token);
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    this.token = null;
  }

  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth && this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return headers;
  }

  // --------------------
  // Core request
  // --------------------
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.auth !== false),
      ...options,
    };

    try {
      const res = await fetch(url, config);
      const data = await res.json();

      if (!res.ok) {
        console.error('API request failed:', res.status, data);
        throw new Error(data.message || `HTTP ${res.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // --------------------
  // Auth Endpoints
  // --------------------
  async login(credentials) {
    const data = await this.request('/api/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password.trim(),
      }),
      auth: false,
    });

    // Store tokens if returned
    if (data?.data?.access) this.setToken(data.data.access);
    if (data?.data?.refresh) this.setRefreshToken(data.data.refresh);

    return data;
  }

  async register(userData) {
    return this.request('/api/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
      auth: false,
    });
  }

  async refreshToken() {
    const refresh = this.getRefreshToken();
    if (!refresh) throw new Error('No refresh token available');

    const data = await this.request('/api/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
      auth: false,
    });

    if (data?.access) this.setToken(data.access);
    return data;
  }

  async logout() {
    this.removeToken();
  }

  // --------------------
  // Profile
  // --------------------
  async getProfile() {
    return this.request('/api/accounts/profile/');
  }

  // Example: protected endpoint
  async getProperties() {
    return this.request('/api/properties/');
  }
}

const apiClient = new ApiClient();
export default apiClient;
