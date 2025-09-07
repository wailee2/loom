import API from "./apiClient";

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/accounts/login/", { email, password });
    return response.data; // { status, data, message }
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};
