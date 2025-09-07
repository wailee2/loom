const BASE_URL = 'https://greengrass-backend.onrender.com';

class ApiClient {
  constructor() {
    this.baseURL = BASE_URL;
    this.token = this.getStoredToken();
  }

  // Token utilities
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

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.auth !== false),
      ...options,
    };

    try {
      const res = await fetch(url, config);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
  return this.request('/api/accounts/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'   // <- important!
    },
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password.trim(),
    }),
    auth: false,
  });
}


  async register(userData) {
    return this.request('/api/accounts/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'   // <- important!
      },
      body: JSON.stringify(userData),
      auth: false,
    });
  }

  async getProfile() {
    return this.request('/api/accounts/profile/');
  }
}

const apiClient = new ApiClient();
export default apiClient;
