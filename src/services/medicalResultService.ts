import axiosInstance from "../config/axios";

interface MedicalResultCreateRequest {
  name: string;
  note: string;
  diagnose: string;
  total_money: number;
  created_at: string; // ISO format: yyyy-MM-ddTHH:mm:ss.SSSZ
  appointment_id: number;
}

interface MedicalResultCreateResponse {
  code: number;
  message: string;
  data: number; // medical result ID
}

export const medicalResultService = {
  /**
   * Tạo kết quả khám bệnh mới
   */
  create: async (data: MedicalResultCreateRequest): Promise<MedicalResultCreateResponse> => {
    const response = await axiosInstance.post<MedicalResultCreateResponse>("/medical_results/create", data);
    return response.data;
  },
};

export type { MedicalResultCreateRequest, MedicalResultCreateResponse };
