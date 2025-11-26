import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { profileApi } from "../../api";
import type { IUserProfile } from "../../types/health";

interface IState {
  profile: IUserProfile | null;
  loading: boolean;
}

const initialState: IState = {
  profile: null,
  loading: false,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async () => {
    const res = await authService.getProfile();
    // Map backend response to IUserProfile
    const profile: IUserProfile = {
      id: String(res.data.id),
      name: res.data.fullName,
    };
    return profile;
  }
);

export const saveProfile = createAsyncThunk(
  "profile/saveProfile",
  async (payload: IUserProfile) => {
    const res = await profileApi.update(payload);
    return res.data;
  }
);

const slice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (s) => {
      s.loading = true;
    });
    builder.addCase(fetchProfile.fulfilled, (s, a) => {
      s.loading = false;
      s.profile = a.payload;
    });
    builder.addCase(fetchProfile.rejected, (s) => {
      s.loading = false;
    });

    builder.addCase(saveProfile.pending, (s) => {
      s.loading = true;
    });
    builder.addCase(saveProfile.fulfilled, (s, a) => {
      s.loading = false;
      s.profile = a.payload;
    });
    builder.addCase(saveProfile.rejected, (s) => {
      s.loading = false;
    });
  },
});

export default slice.reducer;
