import { authService } from "../services/authService";
import { store } from "../redux/store";
import { setUserLoginInfo, setLogoutAction } from "../redux/slice/accountSlice";

export async function initAuth() {
  if (!authService.isAuthenticated()) return;
  
  // Thử lấy user info từ localStorage trước (nhanh hơn)
  const userInfo = authService.getUserInfo();
  if (userInfo) {
    store.dispatch(setUserLoginInfo(userInfo));
  }
  
  // Vẫn gọi API để đảm bảo data mới nhất
  try {
    const res = await authService.getProfile();
    if (res && res.data) {
      const userData = res.data;
      // Transform backend data to match IUser interface
      const userInfo = {
        id: userData.id,
        email: userData.email || '',
        name: userData.fullName,
        phone: userData.phone,
        role: { id: '', name: userData.roleName },
      };
      authService.setUserInfo(userInfo);
      store.dispatch(setUserLoginInfo(userInfo));
    }
  } catch (err) {
    // invalid token or error -> logout
    await authService.logout();
    store.dispatch(setLogoutAction());
  }
}
