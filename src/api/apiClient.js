// src/api/apiClient.js
const BASE_URL = "https://greengrass-backend.onrender.com"; // change to your backend

export class ApiClient {
  constructor() {
    this.baseURL = BASE_URL;
  }

  getAccessToken() {
    return localStorage.getItem("access");
  }

  getRefreshToken() {
    return localStorage.getItem("refresh");
  }

  async request(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Attach access token if available
    const token = this.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    // If token expired, try refresh
    if (response.status === 401 && this.getRefreshToken()) {
      const newAccess = await this.refreshToken();
      if (newAccess) {
        headers["Authorization"] = `Bearer ${newAccess}`;
        return fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers,
        });
      }
    }

    return response;
  }

  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: this.getRefreshToken() }),
      });

      if (!response.ok) throw new Error("Failed to refresh token");

      const data = await response.json();
      localStorage.setItem("access", data.access);
      return data.access;
    } catch (err) {
      console.error("Refresh token failed:", err);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return null;
    }
  }
}

export const apiClient = new ApiClient();
