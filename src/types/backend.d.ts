// Backend API response types

// Generic API Response wrapper
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// Auth endpoints
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

export interface LoginResponse extends ApiResponse<LoginResponseData> {}

// User information (from token or profile endpoint)
export interface UserInfo {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string; // "ADMIN" | "DOCTOR" | "PATIENT"
}
