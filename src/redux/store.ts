import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlice";
import profileReducer from "./slice/profileSlice";
import familyReducer from "./slice/familySlice";
import appointmentReducer from "./slice/appointmentSlice";
import prescriptionReducer from "./slice/prescriptionSlice";
import recordReducer from "./slice/recordSlice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    profile: profileReducer,
    family: familyReducer,
    appointment: appointmentReducer,
    prescription: prescriptionReducer,
    record: recordReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
