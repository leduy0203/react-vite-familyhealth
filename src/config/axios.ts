import axios from "axios";
import { store } from "../redux/store";
import { setLogoutAction } from "../redux/slice/accountSlice";

const baseURL = import.meta.env.VITE_API_URL ?? "/api";

// Note: authService import causes circular dependency, so we use localStorage directly

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

// Track if we're currently refreshing token to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach token from localStorage for every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      if (!config.headers) (config as any).headers = {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log("🔵 Request:", config.method?.toUpperCase(), config.url);
    console.log("🔑 Token:", token ? "Present" : "None");
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh token
instance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error("❌ Error:", error.message);
    console.error("   URL:", error.config?.url);
    console.error("   Status:", error.response?.status);
    console.error("   CORS:", error.message.includes("CORS") ? "YES - Check backend!" : "NO");
    
    const originalRequest = error.config;
    const status = error?.response?.status;
    
    // If 401 and we haven't tried to refresh yet
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      
      if (!refreshToken) {
        // No refresh token, logout
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post(
          `${baseURL}/auth/refresh-token`,
          { refreshToken },
          { timeout: 10000 }
        );

        if (response.data && response.data.code === 200) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Update tokens in localStorage
          localStorage.setItem("access_token", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }
          
          // Update Authorization header
          instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          // Process queued requests
          processQueue(null, accessToken);
          
          isRefreshing = false;
          
          // Retry original request
          return instance(originalRequest);
        } else {
          throw new Error("Refresh token failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, just reject
    return Promise.reject(error);
  }
);

// Helper function to handle logout
function handleLogout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_info");
  try {
    store.dispatch(setLogoutAction());
  } catch (e) {
    console.error("Error dispatching logout:", e);
  }
  window.location.href = "/login";
}

export default instance;

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem("access_token", token);
  else localStorage.removeItem("access_token");
}
