import axios from "axios";
import { store } from "../redux/store";
import { setLogoutAction } from "../redux/slice/accountSlice";

const baseURL = import.meta.env.VITE_API_URL ?? "/api";

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

// Attach token from localStorage for every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      if (!config.headers) (config as any).headers = {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    
    // Debug CORS
    console.log("🔵 Request:", config.method?.toUpperCase(), config.url);
    console.log("🔑 Token:", token ? "Present" : "None");
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Simple response interceptor to handle 401 (unauthorized)
instance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Error:", error.message);
    console.error("   URL:", error.config?.url);
    console.error("   Status:", error.response?.status);
    console.error("   CORS:", error.message.includes("CORS") ? "YES - Check backend!" : "NO");
    
    const status = error?.response?.status;
    if (status === 401) {
      // clear token and redux state, redirect to login
      localStorage.removeItem("access_token");
      try {
        store.dispatch(setLogoutAction());
      } catch (e) {
        // ignore
      }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem("access_token", token);
  else localStorage.removeItem("access_token");
}
