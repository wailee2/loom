// auth.js
import apiClient from './apiclient.js';

// Token management utilities
export const tokenUtils = {
  // Check if user is authenticated
  isAuthenticated() {
    const token = apiClient.getStoredToken();
    if (!token) return false;
    
    try {
      const payload = this.decodeToken(token);
      return !this.isTokenExpired(payload);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  // Decode JWT token
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token format');
    }
  },

  // Check if token is expired
  isTokenExpired(payload) {
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  },

  // Get user info from token
  getUserFromToken(token = null) {
    const tokenToUse = token || apiClient.getStoredToken();
    if (!tokenToUse) return null;
    
    try {
      const payload = this.decodeToken(tokenToUse);
      return {
        id: payload.user_id,
        username: payload.username,
        email: payload.email,
        exp: payload.exp,
        iat: payload.iat,
      };
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  },

  // Clear all auth data
  clearAuthData() {
    apiClient.removeToken();
  },
};

// Authentication service
export const authService = {
  // Login user
  async login(credentials) {
    try {
      // First authenticate and get tokens
      const tokenResponse = await apiClient.getTokens(credentials);
      
      if (tokenResponse.status === 'success' && tokenResponse.data) {
        const { access, refresh } = tokenResponse.data;
        
        // Store tokens
        apiClient.setToken(access);
        apiClient.setRefreshToken(refresh);
        
        // Get user profile
        const profileResponse = await apiClient.getProfile();
        const user = profileResponse.data;
        
        return {
          success: true,
          user,
          message: 'Login successful',
        };
      } else {
        throw new Error(tokenResponse.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.register(userData);
      
      if (response.status === 'success') {
        return {
          success: true,
          user: response.data,
          message: response.message || 'Registration successful',
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  },

  // Logout user
  async logout() {
    try {
      tokenUtils.clearAuthData();
      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Logout failed',
      };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      if (!tokenUtils.isAuthenticated()) {
        return null;
      }

      const response = await apiClient.getProfile();
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      tokenUtils.clearAuthData();
      return null;
    }
  },

  // Refresh access token
  async refreshToken() {
    try {
      const refreshToken = apiClient.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.request('/api/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
        auth: false,
      });

      if (response.status === 'success' && response.data?.access) {
        apiClient.setToken(response.data.access);
        return response.data.access;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      tokenUtils.clearAuthData();
      throw error;
    }
  },
};

// Form validation utilities
export const validation = {
  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  // Validate username
  isValidUsername(username) {
    // 3-30 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  },

  // Get password strength
  getPasswordStrength(password) {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    if (score < 2) return { strength: 'weak', score };
    if (score < 4) return { strength: 'medium', score };
    return { strength: 'strong', score };
  },

  // Validate registration form
  validateRegistration(formData) {
    const errors = {};

    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (!this.isValidUsername(formData.username)) {
      errors.username = 'Username must be 3-30 characters, alphanumeric and underscores only';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!this.isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Validate login form
  validateLogin(formData) {
    const errors = {};

    if (!formData.username?.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.password?.trim()) {
      errors.password = 'Password is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};