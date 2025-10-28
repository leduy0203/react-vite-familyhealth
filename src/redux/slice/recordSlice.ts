import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/api";
import type { IMedicalRecord } from "../../types/health";

interface IState {
  list: IMedicalRecord[];
  selected: IMedicalRecord | null;
  loading: boolean;
}

const initialState: IState = { list: [], selected: null, loading: false };

export const fetchRecords = createAsyncThunk(
  "record/fetch",
  async (opts?: { ownerId?: string; assignedTo?: string }) => {
    const res = await api.fetchMedicalRecords(opts);
    return res.data as IMedicalRecord[];
  }
);

export const createRecord = createAsyncThunk(
  "record/create",
  async (payload: Partial<IMedicalRecord>) => {
    const res = await api.createRecord(payload);
    return res.data as IMedicalRecord;
  }
);

export const getRecord = createAsyncThunk("record/get", async (id: string) => {
  const res = await api.getRecord(id);
  return res.data as IMedicalRecord;
});

export const transferRecord = createAsyncThunk(
  "record/transfer",
  async ({ id, doctorId }: { id: string; doctorId: string }) => {
    const res = await api.transferRecord(id, doctorId);
    return res.data as IMedicalRecord;
  }
);

export const markRecordViewed = createAsyncThunk(
  "record/viewed",
  async ({
    id,
    doctorId,
    note,
  }: {
    id: string;
    doctorId: string;
    note?: string;
  }) => {
    const res = await api.markRecordViewed(id, doctorId, note);
    return res.data as IMedicalRecord;
  }
);

const slice = createSlice({
  name: "record",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchRecords.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchRecords.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });
    b.addCase(fetchRecords.rejected, (s) => {
      s.loading = false;
    });

    b.addCase(createRecord.fulfilled, (s, a) => {
      s.list.unshift(a.payload);
    });

    b.addCase(getRecord.pending, (s) => {
      s.loading = true;
    });
    b.addCase(getRecord.fulfilled, (s, a) => {
      s.loading = false;
      s.selected = a.payload;
    });
    b.addCase(getRecord.rejected, (s) => {
      s.loading = false;
    });

    b.addCase(transferRecord.fulfilled, (s, a) => {
      s.list = s.list.map((r) => (r.id === a.payload.id ? a.payload : r));
      if (s.selected && s.selected.id === a.payload.id) s.selected = a.payload;
    });

    b.addCase(markRecordViewed.fulfilled, (s, a) => {
      s.list = s.list.map((r) => (r.id === a.payload.id ? a.payload : r));
      if (s.selected && s.selected.id === a.payload.id) s.selected = a.payload;
    });
  },
});

export default slice.reducer;
