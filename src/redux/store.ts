import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlice";
import profileReducer from "./slice/profileSlice";
import appointmentReducer from "./slice/appointmentSlice";
import userReducer from "./slice/userSlice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    profile: profileReducer,
    appointment: appointmentReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
