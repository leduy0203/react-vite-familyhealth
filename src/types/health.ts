export interface IUserProfile {
  id: string;
  name: string;
  gender?: "male" | "female" | "other";
  dob?: string; // ISO date
  address?: string;
  emergencyContact?: { name: string; phone: string };
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: string[];
  vaccines?: { id: string; name: string; date: string; dose?: string }[];
  files?: { id: string; name: string; url?: string }[];
}

export interface IFamilyMember {
  id: string;
  name: string;
  relation?: string;
  dob?: string;
  healthStatus?: string;
  notes?: string;
}

export interface IAppointment {
  id: string | number;
  recordId?: string; // ID hồ sơ bệnh án
  doctorId?: string | number; // ID bác sĩ
  doctorName?: string; // Tên bác sĩ (từ API)
  patientId?: string | number; // ID bệnh nhân
  patientName?: string; // Tên bệnh nhân (từ API)
  appointmentDate?: string; // Ngày giờ hẹn (ISO format) - legacy field
  time?: string; // Ngày giờ hẹn mới từ API backend
  location: string; // Địa điểm khám
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "pending" | "confirmed" | "completed" | "cancelled"; // Trạng thái
  note?: string; // Ghi chú
  doctor?: {
    id: number;
    fullName: string;
    expertise: string;
  };
  member?: {
    id: number;
    fullName: string;
    relation: string;
    bhyt: string;
  };
  // Medical result - Kết quả khám bệnh (khi doctor hoàn thành)
  medicalResult?: {
    id?: number; // ID kết quả khám từ backend
    name?: string; // Tên bệnh nhân
    diagnose?: string; // Chẩn đoán (backend field)
    note?: string; // Ghi chú của bác sĩ (backend field)
    totalMoney?: number; // Tổng chi phí (backend field)
    // Legacy fields for backward compatibility
    diagnosis?: string; // Chẩn đoán (legacy)
    symptoms?: string[]; // Triệu chứng
    treatment?: string; // Hướng điều trị
    prescription?: string; // Đơn thuốc
    labTests?: string[]; // Xét nghiệm yêu cầu
    followUpDate?: string; // Ngày tái khám
    notes?: string; // Ghi chú thêm
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IPrescription {
  id: string;
  meds: { name: string; dosage: string; schedule?: string }[];
  issuedDate?: string;
  instructions?: string;
}

export interface IMedicalRecord {
  id: string;
  ownerId: string; // user or family id who created it
  patientName: string;
  summary?: string;
  files?: { id: string; name: string; url?: string }[];
  createdAt?: string;
  updatedAt?: string;
  status?:
    | "new"
    | "transferred"
    | "viewed"
    | "appointment_suggested"
    | "prescribed"
    | "closed"
    | "rejected";
  assignedDoctorId?: string;
  doctorNotes?: { by: string; note: string; at: string }[];
  linkedAppointmentId?: string;
  linkedPrescriptionId?: string;
}

export interface IDoctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone?: string;
  email?: string;
  address?: string;
  rating: number;
  experience: number; // years
  available: boolean;
  avatar?: string;
  education?: string;
  languages?: string[];
}

export interface IMedicalVisit {
  id: string;
  visitDate: string; // ISO date
  doctorName: string;
  doctorSpecialization: string;
  hospital: string;
  diagnosis: string; // Chẩn đoán
  symptoms?: string[]; // Triệu chứng
  treatment?: string; // Điều trị
  prescriptionId?: string; // Link to prescription
  labTests?: { name: string; result?: string }[]; // Xét nghiệm
  followUpDate?: string; // Ngày tái khám
  notes?: string;
  cost?: number;
  status: "completed" | "follow_up_needed" | "cancelled";
  attachments?: { id: string; name: string; url?: string }[];
  createdAt?: string;
  updatedAt?: string;
}
