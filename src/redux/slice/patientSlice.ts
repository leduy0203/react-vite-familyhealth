import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/api";

export interface IPatient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: string[];
  emergencyContact?: { name: string; phone: string };
  avatar?: string;
  lastVisit?: string;
  totalVisits?: number;
  status?: "active" | "inactive";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IState {
  list: IPatient[];
  selected: IPatient | null;
  loading: boolean;
}

const initialState: IState = { list: [], selected: null, loading: false };

export const fetchPatients = createAsyncThunk(
  "patient/fetch",
  async (opts?: { doctorId?: string }) => {
    const res = await api.getPatients(opts);
    return res.data as IPatient[];
  }
);

export const getPatient = createAsyncThunk(
  "patient/get",
  async (id: string) => {
    const res = await api.getPatient(id);
    return res.data as IPatient;
  }
);

export const updatePatientNotes = createAsyncThunk(
  "patient/updateNotes",
  async ({ id, notes }: { id: string; notes: string }) => {
    const res = await api.updatePatientNotes(id, notes);
    return res.data as IPatient;
  }
);

const slice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchPatients.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchPatients.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });
    b.addCase(fetchPatients.rejected, (s) => {
      s.loading = false;
    });

    b.addCase(getPatient.pending, (s) => {
      s.loading = true;
    });
    b.addCase(getPatient.fulfilled, (s, a) => {
      s.loading = false;
      s.selected = a.payload;
    });
    b.addCase(getPatient.rejected, (s) => {
      s.loading = false;
    });

    b.addCase(updatePatientNotes.fulfilled, (s, a) => {
      s.list = s.list.map((p) => (p.id === a.payload.id ? a.payload : p));
      if (s.selected && s.selected.id === a.payload.id) {
        s.selected = a.payload;
      }
    });
  },
});

export const { clearSelected } = slice.actions;
export default slice.reducer;
