// src/api/index.ts
import { api as mockApi } from "../config/api";

/**
 * Lớp Adapter cho API.
 *
 * Mục đích:
 * 1. Tạo một giao diện (interface) rõ ràng cho các nguồn dữ liệu.
 * 2. Che giấu việc triển khai chi tiết (hiện tại là mock API).
 * 3. Dễ dàng thay thế bằng API thật trong tương lai mà không cần sửa đổi code ở nhiều nơi.
 * 4. Cung cấp kiểu dữ liệu (typing) mạnh hơn cho các hàm API.
 */

export const authApi = {
  login: (creds: any) => mockApi.login(creds.username, creds.password),
  getProfile: mockApi.getProfile,
};

export const recordsApi = {
  getAll: mockApi.fetchMedicalRecords,
  getOne: mockApi.getRecord,
  create: mockApi.createRecord,
  transfer: mockApi.transferRecord,
  markViewed: mockApi.markRecordViewed,
};

export const doctorsApi = {
  getAll: mockApi.getDoctors,
};

export const appointmentsApi = {
  getAll: mockApi.getAppointments,
  create: mockApi.createAppointment,
  update: (id: string, data: any) => mockApi.updateAppointment({ ...data, id }),
};

export const familyApi = {
  getAll: mockApi.getFamilyMembers,
  add: mockApi.addFamilyMember,
  update: mockApi.updateFamilyMember,
  delete: mockApi.deleteFamilyMember,
};

export const prescriptionsApi = {
  getAll: mockApi.getPrescriptions,
  create: mockApi.createPrescription,
};

export const profileApi = {
  get: mockApi.getProfile,
  update: mockApi.updateProfile,
};

// Export một đối tượng tổng hợp để dễ dàng truy cập nếu cần
const api = {
  auth: authApi,
  records: recordsApi,
  doctors: doctorsApi,
  appointments: appointmentsApi,
  family: familyApi,
  prescriptions: prescriptionsApi,
  profile: profileApi,
};

export default api;
