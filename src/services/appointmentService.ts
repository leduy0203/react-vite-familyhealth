import axiosInstance from "../config/axios";
import type { IAppointment } from "../types/health";

interface AppointmentListResponse {
  code: number;
  message: string;
  data: {
    meta: {
      page: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: IAppointment[];
  };
}

interface AppointmentCreateRequest {
  time: string; // yyyy-MM-ddTHH:mm:ss
  location: string;
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  note: string;
  doctor_id: number;
  member_id: number;
}

interface AppointmentCreateResponse {
  code: number;
  message: string;
  data: number; // appointment ID
}

export const appointmentService = {
  /**
   * Lấy danh sách tất cả appointments của gia đình
   */
  getAll: async (): Promise<AppointmentListResponse> => {
    const response = await axiosInstance.get<AppointmentListResponse>("/appointments/getAll");
    return response.data;
  },

  /**
   * Tạo appointment mới
   */
  create: async (data: AppointmentCreateRequest): Promise<AppointmentCreateResponse> => {
    const response = await axiosInstance.post<AppointmentCreateResponse>("/appointments/create", data);
    return response.data;
  },

  /**
   * Cập nhật appointment (confirm, cancel, complete)
   */
  update: async (id: number, data: Partial<AppointmentCreateRequest>): Promise<{ code: number; message: string }> => {
    const response = await axiosInstance.put(`/appointments/update/${id}`, data);
    return response.data;
  },

  /**
   * Xóa appointment
   */
  delete: async (id: number): Promise<{ code: number; message: string }> => {
    const response = await axiosInstance.delete(`/appointments/delete/${id}`);
    return response.data;
  },
};

export type { AppointmentCreateRequest, AppointmentCreateResponse, AppointmentListResponse };
