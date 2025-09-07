import apiClient from './apiClient.js';

export const tokenUtils = {
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (err) {
      console.error('Invalid token format', err);
      throw err;
    }
  },

  isAuthenticated() {
    const token = apiClient.getStoredToken();
    if (!token) return false;
    try {
      const payload = this.decodeToken(token);
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },

  clearAuthData() {
    apiClient.removeToken();
  },
};

export const authService = {
  async login(credentials) {
    try {
      const response = await apiClient.login(credentials);

      if (response.status === 'success' && response.data) {
        const { access, refresh } = response.data;
        apiClient.setToken(access);
        apiClient.setRefreshToken(refresh);

        const profile = await apiClient.getProfile();

        return { success: true, user: profile.data, message: response.message };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  },

  async logout() {
    tokenUtils.clearAuthData();
    return { success: true };
  },

  async getCurrentUser() {
    if (!tokenUtils.isAuthenticated()) return null;
    try {
      const profile = await apiClient.getProfile();
      return profile.data;
    } catch {
      tokenUtils.clearAuthData();
      return null;
    }
  },
};

export const validation = {
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validateLogin(formData) {
    const errors = {};
    if (!formData.email?.trim()) errors.email = 'Email is required';
    if (!formData.password?.trim()) errors.password = 'Password is required';
    return { isValid: Object.keys(errors).length === 0, errors };
  },
};
