import axiosInstance from "../config/axios";
import type {
  DoctorListResponse,
  DoctorListParams,
  IDoctorNew,
} from "../types/doctor.types";

export const doctorService = {
  async getList(params?: DoctorListParams): Promise<DoctorListResponse> {
    try {
      const response = await axiosInstance.get<DoctorListResponse>(
        "/doctors",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    }
  },

  async getById(id: number): Promise<IDoctorNew> {
    const response = await axiosInstance.get(`/doctors/${id}`);
    return response.data.data;
  },
};
