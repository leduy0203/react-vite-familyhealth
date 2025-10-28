import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/api";
import type { IFamilyMember } from "../../types/health";

interface IState {
  members: IFamilyMember[];
  loading: boolean;
}

const initialState: IState = { members: [], loading: false };

export const fetchFamily = createAsyncThunk("family/fetchFamily", async () => {
  const res = await api.getFamilyMembers();
  return res.data;
});

export const addFamily = createAsyncThunk(
  "family/addFamily",
  async (payload: Partial<IFamilyMember>) => {
    const res = await api.addFamilyMember(payload);
    return res.data;
  }
);

export const updateFamily = createAsyncThunk(
  "family/updateFamily",
  async (payload: IFamilyMember) => {
    const res = await api.updateFamilyMember(payload);
    return res.data;
  }
);

export const deleteFamily = createAsyncThunk(
  "family/deleteFamily",
  async (id: string) => {
    const res = await api.deleteFamilyMember(id);
    return res.data;
  }
);

const slice = createSlice({
  name: "family",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFamily.pending, (s) => {
      s.loading = true;
    });
    builder.addCase(fetchFamily.fulfilled, (s, a) => {
      s.loading = false;
      s.members = a.payload;
    });
    builder.addCase(fetchFamily.rejected, (s) => {
      s.loading = false;
    });

    builder.addCase(addFamily.fulfilled, (s, a) => {
      s.members.unshift(a.payload);
    });
    builder.addCase(updateFamily.fulfilled, (s, a) => {
      s.members = s.members.map((m) => (m.id === a.payload.id ? a.payload : m));
    });
    builder.addCase(deleteFamily.fulfilled, (s, a) => {
      s.members = s.members.filter((m) => m.id !== a.payload.id);
    });
  },
});

export default slice.reducer;
