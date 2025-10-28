import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/api";
import type { IPrescription } from "../../types/health";

interface IState {
  list: IPrescription[];
  loading: boolean;
}
const initialState: IState = { list: [], loading: false };

export const fetchPrescriptions = createAsyncThunk(
  "prescription/fetch",
  async () => {
    const res = await api.getPrescriptions();
    return res.data;
  }
);
export const createPrescription = createAsyncThunk(
  "prescription/create",
  async (payload: Partial<IPrescription>) => {
    const res = await api.createPrescription(payload);
    return res.data;
  }
);

const slice = createSlice({
  name: "prescription",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPrescriptions.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchPrescriptions.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload as IPrescription[];
    });
    b.addCase(fetchPrescriptions.rejected, (s) => {
      s.loading = false;
    });

    b.addCase(createPrescription.fulfilled, (s, a) => {
      s.list.unshift(a.payload as IPrescription);
    });
  },
});

export default slice.reducer;
