import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/api";
import type { IAppointment } from "../../types/health";

interface IState {
  list: IAppointment[];
  loading: boolean;
}
const initialState: IState = { list: [], loading: false };

export const fetchAppointments = createAsyncThunk(
  "appointment/fetch",
  async () => {
    const res = await api.getAppointments();
    return res.data;
  }
);
export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (payload: Partial<IAppointment>) => {
    const res = await api.createAppointment(payload);
    return res.data;
  }
);
export const updateAppointment = createAsyncThunk(
  "appointment/update",
  async (payload: IAppointment) => {
    const res = await api.updateAppointment(payload);
    return res.data;
  }
);

const slice = createSlice({
  name: "appointment",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAppointments.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchAppointments.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload as IAppointment[];
    });
    b.addCase(fetchAppointments.rejected, (s) => {
      s.loading = false;
    });

    b.addCase(createAppointment.fulfilled, (s, a) => {
      s.list.unshift(a.payload as IAppointment);
    });
    b.addCase(updateAppointment.fulfilled, (s, a) => {
      s.list = s.list.map((i) =>
        i.id === a.payload.id ? (a.payload as IAppointment) : i
      );
    });
  },
});

export default slice.reducer;
