import axiosInstance from "../config/axios";
import type { LoginResponse } from "../types/backend";

export interface LoginDTO {
  phone: string;
  password: string;
}

export interface UserProfileResponse {
  code: number;
  message: string;
  data: {
    id: number;
    fullName: string;
    email: string | null;
    phone: string;
    roleName: string; // "ADMIN" | "DOCTOR" | "PATIENT"
    active: number; // 0 = inactive, 1 = active
  };
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  code: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  /**
   * Login user with phone and password
   */
  async login(credentials: LoginDTO): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/sign-in",
        credentials
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng nhập thất bại";
      throw new Error(message);
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await axiosInstance.get<UserProfileResponse>("/users/me/profile");
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Không thể lấy thông tin người dùng";
      throw new Error(message);
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(data: RefreshTokenDTO): Promise<RefreshTokenResponse> {
    try {
      const response = await axiosInstance.post<RefreshTokenResponse>(
        "/auth/refresh-token",
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Không thể làm mới token";
      throw new Error(message);
    }
  },

  /**
   * Logout user (optional - if backend has logout endpoint)
   */
  async logout(): Promise<void> {
    try {
      // TODO: Call backend logout endpoint if available
      // await axiosInstance.post("/auth/logout");
      
      // Clear local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_info");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage even if API fails
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_info");
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  },

  /**
   * Store tokens in localStorage
   */
  setTokens(accessToken: string, refreshToken: string, userId: number): void {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user_id", userId.toString());
  },

  /**
   * Store user info in localStorage
   */
  setUserInfo(userInfo: any): void {
    localStorage.setItem("user_info", JSON.stringify(userInfo));
  },

  /**
   * Get stored user info
   */
  getUserInfo(): any | null {
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        return null;
      }
    }
    return null;
  },
};
