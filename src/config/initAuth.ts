import { api } from "./api";
import { store } from "../redux/store";
import { setUserLoginInfo, setLogoutAction } from "../redux/slice/accountSlice";

export async function initAuth() {
  const token = localStorage.getItem("access_token");
  if (!token) return;
  
  // Thử lấy user info từ localStorage trước (nhanh hơn)
  const userInfoStr = localStorage.getItem("user_info");
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      store.dispatch(setUserLoginInfo(userInfo));
    } catch (e) {
      // Parse error, will fetch from API below
    }
  }
  
  // Vẫn gọi API để đảm bảo data mới nhất
  try {
    const res = await api.getProfile();
    if (res && res.data) {
      localStorage.setItem("user_info", JSON.stringify(res.data));
      store.dispatch(setUserLoginInfo(res.data));
    }
  } catch (err) {
    // invalid token or error -> clear
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_info");
    store.dispatch(setLogoutAction());
  }
}
