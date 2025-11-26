/**
 * ⚠️ DEPRECATED API Layer
 * 
 * File này chỉ còn export những API chưa migrate sang services/
 * Đang dần được thay thế bởi service pattern
 */

import { api as mockApi } from "../config/api";

// ✅ Records API (chưa có service)
export const recordsApi = {
  getAll: mockApi.fetchMedicalRecords,
  getOne: mockApi.getRecord,
  create: mockApi.createRecord,
  transfer: mockApi.transferRecord,
  markViewed: mockApi.markRecordViewed,
};

// ✅ Doctors for transfer (chưa có trong doctorService)
export const doctorsApi = {
  getAll: mockApi.getDoctors,
};

// ✅ Prescriptions (chưa có service)
export const prescriptionsApi = {
  getAll: mockApi.getPrescriptions,
  create: mockApi.createPrescription,
};

// ✅ Profile update (chưa có service)
export const profileApi = {
  update: mockApi.updateProfile,
};

// Export tổng hợp
const api = {
  records: recordsApi,
  doctors: doctorsApi,
  prescriptions: prescriptionsApi,
  profile: profileApi,
};

export default api;
