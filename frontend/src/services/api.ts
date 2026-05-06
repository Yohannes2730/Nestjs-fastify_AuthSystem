import axios from "axios";

export const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    return Promise.reject(error);
  }
);

export interface User {
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export const authApi = {
  register: (data: { username: string; email: string; password: string; confirmPassword: string }) =>
    api.post("users/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  verifyOtp: (data: { email: string; otp: string }) =>
    api.post("/auth/verify-otp", data),
  resendOtp: (data: { email: string }) => api.post("/auth/resend-otp", data),
  profile: () => api.get<User>("/auth/profile"),
};
