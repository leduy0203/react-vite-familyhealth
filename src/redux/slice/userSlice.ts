import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/api";

export interface ISystemUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: { id: string; name: string };
  permissions: string[];
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

interface IState {
  list: ISystemUser[];
  loading: boolean;
}

const initialState: IState = { list: [], loading: false };

export const fetchUsers = createAsyncThunk("user/fetchAll", async () => {
  const res = await api.getUsers();
  return res.data as ISystemUser[];
});

export const createUser = createAsyncThunk(
  "user/create",
  async (user: Partial<ISystemUser>) => {
    const res = await api.createUser(user);
    return res.data as ISystemUser;
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (user: ISystemUser) => {
    const res = await api.updateUser(user);
    return res.data as ISystemUser;
  }
);

export const deleteUser = createAsyncThunk("user/delete", async (id: string) => {
  await api.deleteUser(id);
  return id;
});

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchUsers.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });
    b.addCase(fetchUsers.rejected, (s) => {
      s.loading = false;
    });

    b.addCase(createUser.fulfilled, (s, a) => {
      s.list.unshift(a.payload);
    });

    b.addCase(updateUser.fulfilled, (s, a) => {
      s.list = s.list.map((u) => (u.id === a.payload.id ? a.payload : u));
    });

    b.addCase(deleteUser.fulfilled, (s, a) => {
      s.list = s.list.filter((u) => u.id !== a.payload);
    });
  },
});

export default slice.reducer;
