import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the user information
interface IUser {
  id: string;
  email: string;
  name: string;
  role: {
    id: string;
    name: string;
  };
}

// Define a type for the slice state
export interface IAccountState {
  isAuthenticated: boolean;
  user: IUser;
}

// Define the initial state using that type
const initialState: IAccountState = {
  isAuthenticated: false,
  user: {
    id: "",
    email: "",
    name: "",
    role: { id: "", name: "" },
  },
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUserLoginInfo: (state, action: PayloadAction<IUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    setLogoutAction: (state) => {
      state.isAuthenticated = false;
      state.user = {
        id: "",
        email: "",
        name: "",
        role: { id: "", name: "" },
      };
    },
  },
});

export const { setUserLoginInfo, setLogoutAction } = accountSlice.actions;

export default accountSlice.reducer;
