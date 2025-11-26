import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appointmentService } from "../../services/appointmentService";
import type { IAppointment } from "../../types/health";

interface IState {
  list: IAppointment[];
  loading: boolean;
}
const initialState: IState = { list: [], loading: false };

export const fetchAppointments = createAsyncThunk(
  "appointment/fetch",
  async () => {
    try {
      const response = await appointmentService.getAll();
      if (response.code === 200) {
        return response.data.result;
      }
      return [];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  }
);

export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (payload: any) => {
    const response = await appointmentService.create(payload);
    if (response.code === 201) {
      // Sau khi tạo thành công, fetch lại toàn bộ danh sách
      const allAppointments = await appointmentService.getAll();
      return allAppointments.data.result.find((apt) => apt.id === response.data);
    }
    throw new Error(response.message);
  }
);

export const updateAppointment = createAsyncThunk(
  "appointment/update",
  async (payload: IAppointment) => {
    // Map legacy status to new status
    const statusMap: Record<string, "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED"> = {
      pending: "SCHEDULED",
      confirmed: "CONFIRMED",
      completed: "COMPLETED",
      cancelled: "CANCELLED",
      SCHEDULED: "SCHEDULED",
      CONFIRMED: "CONFIRMED",
      COMPLETED: "COMPLETED",
      CANCELLED: "CANCELLED",
    };
    
    const response = await appointmentService.update(Number(payload.id), {
      status: statusMap[payload.status],
      note: payload.note,
    });
    if (response.code === 200) {
      return payload;
    }
    throw new Error(response.message);
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
      s.list = a.payload;
    });
    b.addCase(fetchAppointments.rejected, (s) => {
      s.loading = false;
    });

    b.addCase(createAppointment.fulfilled, (s, a) => {
      if (a.payload) {
        s.list.unshift(a.payload);
      }
    });
    b.addCase(updateAppointment.fulfilled, (s, a) => {
      s.list = s.list.map((i) => (i.id === a.payload.id ? a.payload : i));
    });
  },
});

export default slice.reducer;
