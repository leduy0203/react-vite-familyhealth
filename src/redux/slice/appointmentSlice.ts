import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appointmentService } from "../../services/appointmentService";
import type { IAppointment } from "../../types/health";

interface IState {
  list: IAppointment[];
  loading: boolean;
}

// Mock data for testing
const mockAppointments: IAppointment[] = [
  {
    id: 1,
    doctorId: 1,
    doctorName: "BS. Nguyễn Văn A",
    patientId: 1,
    patientName: "Trần Thị B",
    appointmentDate: "2025-11-28T09:00:00",
    time: "2025-11-28T09:00:00",
    location: "Phòng khám Nội - Tầng 2",
    status: "SCHEDULED",
    note: "Đau đầu kéo dài 3 ngày, chóng mặt khi đứng dậy. Có tiền sử huyết áp cao.",
    doctor: {
      id: 1,
      fullName: "BS. Nguyễn Văn A",
      expertise: "Nội tổng quát",
    },
    member: {
      id: 1,
      fullName: "Trần Thị B",
      relation: "Bản thân",
      bhyt: "DN123456789",
    },
    createdAt: "2025-11-27T14:30:00",
  },
  {
    id: 2,
    doctorId: 1,
    doctorName: "BS. Nguyễn Văn A",
    patientId: 2,
    patientName: "Lê Văn C",
    appointmentDate: "2025-11-28T10:00:00",
    time: "2025-11-28T10:00:00",
    location: "Phòng khám Nội - Tầng 2",
    status: "SCHEDULED",
    note: "Khám tổng quát định kỳ",
    doctor: {
      id: 1,
      fullName: "BS. Nguyễn Văn A",
      expertise: "Nội tổng quát",
    },
    member: {
      id: 2,
      fullName: "Lê Văn C",
      relation: "Con",
      bhyt: "DN987654321",
    },
    createdAt: "2025-11-27T15:00:00",
  },
  {
    id: 3,
    doctorId: 1,
    doctorName: "BS. Nguyễn Văn A",
    patientId: 3,
    patientName: "Phạm Thị D",
    appointmentDate: "2025-11-28T14:00:00",
    time: "2025-11-28T14:00:00",
    location: "Phòng khám Nội - Tầng 2",
    status: "CONFIRMED",
    note: "Tái khám sau điều trị viêm dạ dày",
    doctor: {
      id: 1,
      fullName: "BS. Nguyễn Văn A",
      expertise: "Nội tổng quát",
    },
    member: {
      id: 3,
      fullName: "Phạm Thị D",
      relation: "Vợ/Chồng",
      bhyt: "HN456789123",
    },
    createdAt: "2025-11-26T10:00:00",
  },
  {
    id: 4,
    doctorId: 1,
    doctorName: "BS. Nguyễn Văn A",
    patientId: 4,
    patientName: "Hoàng Văn E",
    appointmentDate: "2025-11-29T09:30:00",
    time: "2025-11-29T09:30:00",
    location: "Phòng khám Nội - Tầng 2",
    status: "SCHEDULED",
    note: "Ho kéo dài 2 tuần, sốt nhẹ",
    doctor: {
      id: 1,
      fullName: "BS. Nguyễn Văn A",
      expertise: "Nội tổng quát",
    },
    member: {
      id: 4,
      fullName: "Hoàng Văn E",
      relation: "Cha/Mẹ",
      bhyt: "SG789123456",
    },
    createdAt: "2025-11-27T16:45:00",
  },
  {
    id: 5,
    doctorId: 1,
    doctorName: "BS. Nguyễn Văn A",
    patientId: 5,
    patientName: "Vũ Thị F",
    appointmentDate: "2025-11-27T15:00:00",
    time: "2025-11-27T15:00:00",
    location: "Phòng khám Nội - Tầng 2",
    status: "COMPLETED",
    note: "Khám sức khỏe tổng quát",
    doctor: {
      id: 1,
      fullName: "BS. Nguyễn Văn A",
      expertise: "Nội tổng quát",
    },
    member: {
      id: 5,
      fullName: "Vũ Thị F",
      relation: "Bản thân",
      bhyt: "HCM321654987",
    },
    createdAt: "2025-11-25T09:00:00",
  },
];

const initialState: IState = { 
  list: mockAppointments, // Use mock data initially
  loading: false 
};

export const fetchAppointments = createAsyncThunk(
  "appointment/fetch",
  async () => {
    try {
      const response = await appointmentService.getAll();
      if (response.code === 200) {
        return response.data.result;
      }
      // Return mock data if API fails or returns empty
      return mockAppointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Return mock data on error
      return mockAppointments;
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
