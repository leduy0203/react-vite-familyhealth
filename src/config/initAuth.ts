import { api } from "./api";
import { store } from "../redux/store";
import { setUserLoginInfo, setLogoutAction } from "../redux/slice/accountSlice";

export async function initAuth() {
  const token = localStorage.getItem("access_token");
  if (!token) return;
  try {
    const res = await api.getProfile();
    if (res && res.data) {
      store.dispatch(setUserLoginInfo(res.data));
    }
  } catch (err) {
    // invalid token or error -> clear
    localStorage.removeItem("access_token");
    store.dispatch(setLogoutAction());
  }
}
