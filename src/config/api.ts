// Simple fake API to simulate backend for development

import type { IDoctor } from "../types/health";

/**
 * 🔐 HỆ THỐNG PHÂN QUYỀN THEO 3 ROLES
 * 
 * ============================================
 * 1️⃣ ADMIN - Quản trị viên
 * ============================================
 * 📊 Menu:
 *    - Quản trị (Submenu)
 *      ├── Thống kê (/admin/dashboard)
 *      ├── Người dùng (/admin/users)
 *      └── Quản lý bác sĩ (/admin/doctors)
 * 
 * 🎯 Chức năng:
 *    - Xem tổng quan hệ thống
 *    - Quản lý người dùng (CRUD)
 *    - Quản lý bác sĩ (CRUD)
 *    - Xem thống kê, báo cáo
 * 
 * ============================================
 * 2️⃣ DOCTOR - Bác sĩ
 * ============================================
 * 📊 Menu:
 *    - Lịch khám bệnh (/doctor/appointments)
 * 
 * 🎯 Chức năng:
 *    - Xem lịch khám của mình
 *    - Cập nhật trạng thái lịch hẹn
 *    - Thêm kết quả khám bệnh
 *    - Quản lý bệnh nhân của mình
 * 
 * ============================================
 * 3️⃣ PATIENT - Bệnh nhân/Người dùng
 * ============================================
 * 📊 Menu:
 *    - Dashboard (/)
 *    - Thành viên (/family)
 *    - Lịch hẹn (/appointments)
 *    - Danh sách bác sĩ (/doctors)
 *    - Kết quả khám (/history)
 * 
 * 🎯 Chức năng:
 *    - Xem dashboard cá nhân
 *    - Quản lý thành viên gia đình
 *    - Đặt lịch khám bệnh
 *    - Tìm kiếm bác sĩ
 *    - Xem kết quả khám bệnh
 * ============================================
 */
export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: { id: string; name: UserRole };
}

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const api = {
  login: async (username: string, password: string) => {
    // very simple fake validation
    if (!username || !password) {
      return Promise.reject({ message: "Username and password required" });
    }
    const uname = username.toLowerCase();
    let user: IUser;
    let token = "mock-token-user";

    // 🔐 ADMIN Role - Quản trị toàn bộ hệ thống
    if (uname.includes("admin")) {
      user = {
        id: "admin",
        email: username,
        name: "Admin Demo",
        role: { id: "1", name: "ADMIN" },
      };
      token = "mock-token-admin";
    } 
    // 🩺 DOCTOR Role - Bác sĩ quản lý lịch khám
    else if (uname.includes("doctor")) {
      user = {
        id: "doctor",
        email: username,
        name: "Bác sĩ Demo",
        role: { id: "2", name: "DOCTOR" },
      };
      token = "mock-token-doctor";
    } 
    // 👤 PATIENT Role - Người dùng/Bệnh nhân
    else {
      user = {
        id: "user",
        email: username,
        name: "Người Dùng Demo",
        role: { id: "3", name: "PATIENT" },
      };
      token = "mock-token-patient";
    }

    const response = { data: { access_token: token, user } };
    return delay(600, response);
  },

  getProfile: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return Promise.reject({ message: "No token" });

    let user: IUser;
    
    // 🔐 ADMIN - Toàn quyền
    if (token === "mock-token-admin") {
      user = {
        id: "admin",
        email: "admin@local",
        name: "Admin Demo",
        role: { id: "1", name: "ADMIN" },
      };
    } 
    // 🩺 DOCTOR - Quản lý lịch khám
    else if (token === "mock-token-doctor") {
      user = {
        id: "doctor",
        email: "doctor@local",
        name: "Bác sĩ Demo",
        role: { id: "2", name: "DOCTOR" },
      };
    } 
    // 👤 PATIENT - Người dùng
    else {
      user = {
        id: "patient",
        email: "patient@local",
        name: "Bệnh Nhân Demo",
        role: { id: "3", name: "PATIENT" },
      };
    }
    return delay(400, { data: user });
  },

  fetchRecords: async () => {
    const records = [
      { id: "r1", name: "Hồ sơ A", owner: "Gia đình" },
      { id: "r2", name: "Hồ sơ B", owner: "Gia đình" },
    ];
    return delay(300, { data: records });
  },
  // Profile endpoints
  updateProfile: async (profile: any) => {
    // pretend save
    return delay(300, { data: profile });
  },

  // Family endpoints
  getFamilyMembers: async () => {
    const members = [
      {
        id: "m1",
        name: "Nguyễn Văn A",
        relation: "Chồng",
        dob: "1985-01-01",
        healthStatus: "Bình thường",
      },
      {
        id: "m2",
        name: "Trần Thị B",
        relation: "Vợ",
        dob: "1987-03-05",
        healthStatus: "Nghiêm trọng",
      },
    ];
    return delay(300, { data: members });
  },
  addFamilyMember: async (member: any) => {
    const item = { ...member, id: `m${Date.now()}` };
    return delay(200, { data: item });
  },
  updateFamilyMember: async (member: any) => {
    return delay(200, { data: member });
  },
  deleteFamilyMember: async (id: string) => {
    return delay(200, { data: { id } });
  },

  // Appointments
  getAppointments: async () => {
    const appts = [
      {
        id: "a1",
        recordId: "rec1",
        doctorId: "doc1",
        doctorName: "BS. Nguyễn Văn An",
        patientId: "m1",
        patientName: "Nguyễn Văn A",
        appointmentDate: "2025-11-05T09:00:00",
        location: "Phòng khám Đa khoa Gia Đình, 123 Đường ABC",
        status: "confirmed",
        note: "Tái khám sau 2 tuần điều trị",
        createdAt: "2025-10-28T10:00:00",
      },
      {
        id: "a2",
        recordId: "rec2",
        doctorId: "doc2",
        doctorName: "BS. Trần Thị Bình",
        patientId: "m2",
        patientName: "Trần Thị B",
        appointmentDate: "2025-10-30T14:30:00",
        location: "Bệnh viện Đa khoa Trung ương, Tầng 3",
        status: "pending",
        note: "Khám tổng quát định kỳ",
        createdAt: "2025-10-25T08:00:00",
      },
      {
        id: "a3",
        recordId: "rec3",
        doctorId: "doc1",
        doctorName: "BS. Nguyễn Văn An",
        patientId: "m1",
        patientName: "Nguyễn Văn A",
        appointmentDate: "2025-10-15T10:00:00",
        location: "Phòng khám Đa khoa Gia Đình, 123 Đường ABC",
        status: "completed",
        note: "Khám sức khỏe đã hoàn thành",
        createdAt: "2025-10-10T09:00:00",
      },
    ];
    return delay(300, { data: appts });
  },
  createAppointment: async (appt: any) => {
    return delay(200, { data: { ...appt, id: `a${Date.now()}` } });
  },
  updateAppointment: async (appt: any) => {
    return delay(200, { data: appt });
  },

  // Prescriptions
  getPrescriptions: async () => {
    const list = [
      {
        id: "p1",
        meds: [
          { name: "Paracetamol", dosage: "500mg", schedule: "2 lần/ngày" },
        ],
        issuedDate: "2025-10-01",
      },
    ];
    return delay(300, { data: list });
  },
  createPrescription: async (presc: any) => {
    return delay(200, { data: { ...presc, id: `p${Date.now()}` } });
  },
  // Medical Records (mock)
  _records: [
    {
      id: "rec1",
      ownerId: "1",
      patientName: "Nguyễn Văn A",
      summary: "Đau đầu, sốt nhẹ",
      files: [],
      createdAt: new Date().toISOString(),
      status: "new",
    },
  ],

  createRecord: async (rec: any) => {
    const item = {
      ...rec,
      id: `rec${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "new",
    };
    (api as any)._records.unshift(item);
    return delay(200, { data: item });
  },
  // Doctors list for transfer
  getDoctors: async () => {
    const docs = [
      { id: "doc1", name: "Bác sĩ Nguyễn" },
      { id: "doc2", name: "Bác sĩ Trần" },
      { id: "doc3", name: "Bác sĩ Lê" },
    ];
    return delay(150, { data: docs });
  },

  // Full doctors list for doctors page
  // TODO: Replace with real API call
  // Example: return axios.get('/api/doctors')
  getDoctorsList: async (): Promise<{ data: IDoctor[] }> => {
    const doctors: IDoctor[] = [
      {
        id: "doc1",
        name: "BS. Nguyễn Văn An",
        specialization: "Nội khoa",
        hospital: "Bệnh viện Đa khoa Trung ương",
        phone: "0912345678",
        email: "bs.an@hospital.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        rating: 4.8,
        experience: 15,
        available: true,
        education: "Bác sĩ chuyên khoa II",
        languages: ["Tiếng Việt", "English"],
      },
      {
        id: "doc2",
        name: "BS. Trần Thị Bình",
        specialization: "Nhi khoa",
        hospital: "Bệnh viện Nhi đồng 1",
        phone: "0987654321",
        email: "bs.binh@hospital.com",
        address: "456 Đường XYZ, Quận 3, TP.HCM",
        rating: 4.9,
        experience: 12,
        available: true,
        education: "Tiến sĩ Y học",
        languages: ["Tiếng Việt", "English", "Français"],
      },
      {
        id: "doc3",
        name: "BS. Lê Minh Cường",
        specialization: "Tim mạch",
        hospital: "Viện Tim mạch Quốc gia",
        phone: "0901234567",
        email: "bs.cuong@hospital.com",
        address: "789 Đường DEF, Quận 5, TP.HCM",
        rating: 4.7,
        experience: 20,
        available: false,
        education: "Bác sĩ chuyên khoa II",
        languages: ["Tiếng Việt"],
      },
      {
        id: "doc4",
        name: "BS. Phạm Thu Hà",
        specialization: "Sản phụ khoa",
        hospital: "Bệnh viện Từ Dũ",
        phone: "0923456789",
        email: "bs.ha@hospital.com",
        address: "321 Đường GHI, Quận 1, TP.HCM",
        rating: 4.6,
        experience: 10,
        available: true,
        education: "Bác sĩ chuyên khoa I",
        languages: ["Tiếng Việt", "English"],
      },
      {
        id: "doc5",
        name: "BS. Hoàng Minh Tuấn",
        specialization: "Nội khoa",
        hospital: "Bệnh viện Chợ Rẫy",
        phone: "0934567890",
        email: "bs.tuan@hospital.com",
        address: "654 Đường JKL, Quận 5, TP.HCM",
        rating: 4.5,
        experience: 8,
        available: true,
        education: "Bác sĩ chuyên khoa I",
        languages: ["Tiếng Việt"],
      },
      {
        id: "doc6",
        name: "BS. Võ Thị Mai",
        specialization: "Da liễu",
        hospital: "Bệnh viện Da liễu TP.HCM",
        phone: "0945678901",
        email: "bs.mai@hospital.com",
        address: "987 Đường MNO, Quận 10, TP.HCM",
        rating: 4.4,
        experience: 7,
        available: true,
        education: "Bác sĩ chuyên khoa I",
        languages: ["Tiếng Việt", "English"],
      },
      {
        id: "doc7",
        name: "BS. Đặng Văn Khoa",
        specialization: "Ngoại khoa",
        hospital: "Bệnh viện Nhân dân 115",
        phone: "0956789012",
        email: "bs.khoa@hospital.com",
        address: "246 Đường PQR, Quận Tân Bình, TP.HCM",
        rating: 4.7,
        experience: 18,
        available: true,
        education: "Bác sĩ chuyên khoa II",
        languages: ["Tiếng Việt"],
      },
      {
        id: "doc8",
        name: "BS. Ngô Thị Lan",
        specialization: "Mắt",
        hospital: "Bệnh viện Mắt TP.HCM",
        phone: "0967890123",
        email: "bs.lan@hospital.com",
        address: "135 Đường STU, Quận 3, TP.HCM",
        rating: 4.8,
        experience: 14,
        available: false,
        education: "Tiến sĩ Y học",
        languages: ["Tiếng Việt", "English"],
      },
    ];
    return delay(300, { data: doctors });
  },

  // Get doctor by ID
  // TODO: Replace with real API call
  // Example: return axios.get(`/api/doctors/${id}`)
  getDoctorById: async (id: string): Promise<{ data: IDoctor }> => {
    const res = await api.getDoctorsList();
    const doctor = res.data.find((d) => d.id === id);
    if (!doctor) return Promise.reject({ message: "Doctor not found" });
    return delay(200, { data: doctor });
  },

  fetchMedicalRecords: async (opts?: {
    ownerId?: string;
    assignedTo?: string;
  }) => {
    let list = (api as any)._records as any[];
    if (opts?.ownerId) list = list.filter((r) => r.ownerId === opts.ownerId);
    if (opts?.assignedTo)
      list = list.filter((r) => r.assignedDoctorId === opts.assignedTo);
    return delay(250, { data: list });
  },

  getRecord: async (id: string) => {
    const item = ((api as any)._records as any[]).find((r) => r.id === id);
    if (!item) return Promise.reject({ message: "Not found" });
    return delay(200, { data: item });
  },

  transferRecord: async (recordId: string, doctorId: string) => {
    const recs = (api as any)._records as any[];
    const idx = recs.findIndex((r) => r.id === recordId);
    if (idx === -1) return Promise.reject({ message: "Not found" });
    recs[idx].assignedDoctorId = doctorId;
    recs[idx].status = "transferred";
    return delay(200, { data: recs[idx] });
  },

  markRecordViewed: async (
    recordId: string,
    doctorId: string,
    note?: string
  ) => {
    const recs = (api as any)._records as any[];
    const idx = recs.findIndex((r) => r.id === recordId);
    if (idx === -1) return Promise.reject({ message: "Not found" });
    recs[idx].status = "viewed";
    recs[idx].doctorNotes = recs[idx].doctorNotes || [];
    if (note)
      recs[idx].doctorNotes.push({
        by: doctorId,
        note,
        at: new Date().toISOString(),
      });
    return delay(200, { data: recs[idx] });
  },

  // Patients Management
  // TODO: Replace with real API call
  getPatients: async (_opts?: { doctorId?: string }): Promise<{ data: any[] }> => {
    const patients = [
      {
        id: "patient1",
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0912345678",
        dob: "1985-05-15",
        gender: "male",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        bloodType: "O+",
        allergies: ["Penicillin", "Đậu phộng"],
        medicalHistory: ["Tiểu đường type 2", "Cao huyết áp"],
        emergencyContact: { name: "Trần Thị B", phone: "0987654321" },
        lastVisit: "2025-10-20",
        totalVisits: 15,
        status: "active",
        notes: "Bệnh nhân cần theo dõi đường huyết thường xuyên",
        createdAt: "2024-01-15T10:00:00",
      },
      {
        id: "patient2",
        name: "Trần Thị B",
        email: "tranthib@email.com",
        phone: "0987654321",
        dob: "1990-08-22",
        gender: "female",
        address: "456 Đường XYZ, Quận 3, TP.HCM",
        bloodType: "A+",
        allergies: [],
        medicalHistory: ["Viêm xoang mạn tính"],
        emergencyContact: { name: "Nguyễn Văn A", phone: "0912345678" },
        lastVisit: "2025-10-25",
        totalVisits: 8,
        status: "active",
        notes: "",
        createdAt: "2024-03-20T14:00:00",
      },
      {
        id: "patient3",
        name: "Lê Văn C",
        email: "levanc@email.com",
        phone: "0901234567",
        dob: "1978-12-10",
        gender: "male",
        address: "789 Đường DEF, Quận 5, TP.HCM",
        bloodType: "B+",
        allergies: ["Aspirin"],
        medicalHistory: ["Bệnh tim mạch", "Cholesterol cao"],
        emergencyContact: { name: "Phạm Thị D", phone: "0923456789" },
        lastVisit: "2025-09-30",
        totalVisits: 25,
        status: "active",
        notes: "Bệnh nhân cần kiểm tra tim mạch định kỳ 3 tháng/lần",
        createdAt: "2023-06-10T09:00:00",
      },
      {
        id: "patient4",
        name: "Phạm Thị D",
        email: "phamthid@email.com",
        phone: "0934567890",
        dob: "1995-03-18",
        gender: "female",
        address: "321 Đường GHI, Quận 10, TP.HCM",
        bloodType: "AB+",
        allergies: ["Hải sản"],
        medicalHistory: [],
        emergencyContact: { name: "Lê Văn C", phone: "0901234567" },
        lastVisit: "2025-10-28",
        totalVisits: 3,
        status: "active",
        notes: "",
        createdAt: "2025-08-01T11:00:00",
      },
    ];
    return delay(300, { data: patients });
  },

  getPatient: async (id: string): Promise<{ data: any }> => {
    const res = await api.getPatients();
    const patient = res.data.find((p) => p.id === id);
    if (!patient) return Promise.reject({ message: "Patient not found" });
    return delay(200, { data: patient });
  },

  updatePatientNotes: async (id: string, notes: string): Promise<{ data: any }> => {
    const res = await api.getPatient(id);
    const updated = { ...res.data, notes, updatedAt: new Date().toISOString() };
    return delay(200, { data: updated });
  },

  // Medical Visit History
  // TODO: Replace with real API call
  // Example: return axios.get('/api/medical-visits')
  getMedicalVisits: async (): Promise<{ data: any[] }> => {
    const visits = [
      {
        id: "visit1",
        visitDate: "2025-10-20T09:30:00",
        doctorName: "BS. Nguyễn Văn An",
        doctorSpecialization: "Nội khoa",
        hospital: "Bệnh viện Đa khoa Trung ương",
        diagnosis: "Viêm họng cấp",
        symptoms: ["Đau họng", "Sốt nhẹ", "Ho"],
        treatment: "Kê đơn thuốc kháng sinh và thuốc giảm đau",
        prescriptionId: "p1",
        labTests: [
          { name: "Xét nghiệm máu", result: "Bình thường" },
          { name: "Công thức máu", result: "WBC tăng nhẹ" },
        ],
        followUpDate: "2025-11-03",
        notes: "Uống thuốc đầy đủ, nghỉ ngơi",
        cost: 350000,
        status: "completed",
        attachments: [],
        createdAt: "2025-10-20T10:00:00",
      },
      {
        id: "visit2",
        visitDate: "2025-09-15T14:00:00",
        doctorName: "BS. Trần Thị Bình",
        doctorSpecialization: "Tim mạch",
        hospital: "Bệnh viện Tim Hà Nội",
        diagnosis: "Huyết áp cao độ 1",
        symptoms: ["Đau đầu", "Chóng mặt"],
        treatment: "Điều chỉnh chế độ ăn, thuốc hạ huyết áp",
        prescriptionId: "p2",
        labTests: [
          { name: "Điện tâm đồ", result: "Bình thường" },
          { name: "Siêu âm tim", result: "Không có vấn đề" },
        ],
        followUpDate: "2025-10-15",
        notes: "Tái khám sau 1 tháng, theo dõi huyết áp hàng ngày",
        cost: 850000,
        status: "follow_up_needed",
        attachments: [
          { id: "f1", name: "ECG_Report.pdf", url: "/files/ecg1.pdf" },
        ],
        createdAt: "2025-09-15T15:00:00",
      },
      {
        id: "visit3",
        visitDate: "2025-08-10T10:00:00",
        doctorName: "BS. Lê Văn Cường",
        doctorSpecialization: "Tiêu hóa",
        hospital: "Phòng khám Đa khoa Gia Đình",
        diagnosis: "Viêm dạ dày",
        symptoms: ["Đau bụng", "Buồn nôn", "Ăn không tiêu"],
        treatment: "Thuốc bảo vệ niêm mạc dạ dày, chế độ ăn uống",
        prescriptionId: "p3",
        labTests: [{ name: "Nội soi dạ dày", result: "Viêm nhẹ" }],
        notes: "Ăn nhẹ, tránh đồ cay nóng",
        cost: 550000,
        status: "completed",
        attachments: [],
        createdAt: "2025-08-10T11:30:00",
      },
      {
        id: "visit4",
        visitDate: "2025-07-05T08:30:00",
        doctorName: "BS. Phạm Thị Dung",
        doctorSpecialization: "Da liễu",
        hospital: "Bệnh viện Da liễu TP.HCM",
        diagnosis: "Mề đay mạn tính",
        symptoms: ["Ngứa", "Nổi mẩn đỏ"],
        treatment: "Thuốc kháng histamin, kem bôi",
        prescriptionId: "p4",
        labTests: [{ name: "Test dị ứng", result: "Dị ứng bụi" }],
        followUpDate: "2025-08-05",
        notes: "Tránh tiếp xúc với chất gây dị ứng",
        cost: 420000,
        status: "completed",
        attachments: [],
        createdAt: "2025-07-05T09:30:00",
      },
      {
        id: "visit5",
        visitDate: "2025-06-12T15:00:00",
        doctorName: "BS. Hoàng Văn Hùng",
        doctorSpecialization: "Tai Mũi Họng",
        hospital: "Bệnh viện Tai Mũi Họng",
        diagnosis: "Viêm xoang mãn tính",
        symptoms: ["Nghẹt mũi", "Đau đầu vùng trán", "Chảy mũi"],
        treatment: "Xịt mũi, kháng sinh",
        prescriptionId: "p5",
        labTests: [{ name: "X-quang xoang", result: "Xoang mờ đục" }],
        followUpDate: "2025-07-12",
        notes: "Xịt mũi đều đặn 2 lần/ngày",
        cost: 680000,
        status: "completed",
        attachments: [
          { id: "f2", name: "Xray_Sinus.jpg", url: "/files/xray.jpg" },
        ],
        createdAt: "2025-06-12T16:00:00",
      },
    ];
    return delay(300, { data: visits });
  },

  // Get medical visit by ID
  // TODO: Replace with real API call
  getMedicalVisitById: async (id: string): Promise<{ data: any }> => {
    const res = await api.getMedicalVisits();
    const visit = res.data.find((v) => v.id === id);
    if (!visit) return Promise.reject({ message: "Visit not found" });
    return delay(200, { data: visit });
  },

  // Admin: User Management
  _users: [
    // 🔐 ADMIN - Quản trị viên
    {
      id: "admin",
      email: "admin@local",
      name: "Admin Demo",
      phone: "0900000001",
      role: { id: "1", name: "ADMIN" },
      status: "active",
      createdAt: "2024-01-01T00:00:00",
    },
    // 🩺 DOCTOR - Bác sĩ
    {
      id: "doctor1",
      email: "doctor1@local",
      name: "BS. Nguyễn Văn An",
      phone: "0900000002",
      role: { id: "2", name: "DOCTOR" },
      status: "active",
      createdAt: "2024-02-01T00:00:00",
    },
    {
      id: "doctor2",
      email: "doctor2@local",
      name: "BS. Trần Thị Bình",
      phone: "0900000003",
      role: { id: "2", name: "DOCTOR" },
      status: "active",
      createdAt: "2024-02-15T00:00:00",
    },
    // 👤 PATIENT - Bệnh nhân/Người dùng
    {
      id: "patient1",
      email: "patient1@local",
      name: "Nguyễn Văn A",
      phone: "0900000004",
      role: { id: "3", name: "PATIENT" },
      status: "active",
      createdAt: "2024-03-01T00:00:00",
    },
    {
      id: "patient2",
      email: "patient2@local",
      name: "Trần Thị B",
      phone: "0900000005",
      role: { id: "3", name: "PATIENT" },
      status: "active",
      createdAt: "2024-03-15T00:00:00",
    },
  ] as any[],

  getUsers: async (): Promise<{ data: any[] }> => {
    return delay(300, { data: (api as any)._users });
  },

  createUser: async (user: any): Promise<{ data: any }> => {
    const newUser = {
      ...user,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: user.status || "active",
    };
    (api as any)._users.push(newUser);
    return delay(200, { data: newUser });
  },

  updateUser: async (user: any): Promise<{ data: any }> => {
    const users = (api as any)._users;
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index === -1) return Promise.reject({ message: "User not found" });
    users[index] = { ...users[index], ...user, updatedAt: new Date().toISOString() };
    return delay(200, { data: users[index] });
  },

  deleteUser: async (id: string): Promise<{ data: { id: string } }> => {
    const users = (api as any)._users;
    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) return Promise.reject({ message: "User not found" });
    users.splice(index, 1);
    return delay(200, { data: { id } });
  },

  // Admin: Doctor Management Extensions
  updateDoctorInfo: async (id: string, data: any): Promise<{ data: any }> => {
    const doctors = await api.getDoctorsList();
    const doctor = doctors.data.find((d) => d.id === id);
    if (!doctor) return Promise.reject({ message: "Doctor not found" });
    const updated = { ...doctor, ...data, updatedAt: new Date().toISOString() };
    return delay(200, { data: updated });
  },

  getDoctorStats: async (id: string): Promise<{ data: any }> => {
    const stats = {
      doctorId: id,
      totalPatients: Math.floor(Math.random() * 200) + 50,
      totalAppointments: Math.floor(Math.random() * 500) + 100,
      completedAppointments: Math.floor(Math.random() * 400) + 80,
      cancelledAppointments: Math.floor(Math.random() * 50) + 10,
      rating: (Math.random() * 1 + 4).toFixed(1),
      reviewCount: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 100000000) + 50000000,
      monthlyPatients: [
        { month: "T1", count: Math.floor(Math.random() * 50) + 10 },
        { month: "T2", count: Math.floor(Math.random() * 50) + 10 },
        { month: "T3", count: Math.floor(Math.random() * 50) + 10 },
        { month: "T4", count: Math.floor(Math.random() * 50) + 10 },
        { month: "T5", count: Math.floor(Math.random() * 50) + 10 },
        { month: "T6", count: Math.floor(Math.random() * 50) + 10 },
      ],
    };
    return delay(300, { data: stats });
  },

  // Admin: System Statistics
  getSystemStats: async (): Promise<{ data: any }> => {
    const stats = {
      totalUsers: (api as any)._users.length,
      totalDoctors: 8,
      totalPatients: 4,
      totalAppointments: 3,
      newAppointmentsToday: 2,
      newRecordsToday: 1,
      activeUsers: (api as any)._users.filter((u: any) => u.status === "active").length,
      pendingAppointments: 1,
      recentActivities: [
        { id: 1, type: "appointment", message: "Lịch hẹn mới với BS. Nguyễn Văn An", time: "10 phút trước", icon: "calendar" },
        { id: 2, type: "record", message: "Hồ sơ mới từ Nguyễn Văn A", time: "30 phút trước", icon: "file" },
        { id: 3, type: "user", message: "Người dùng mới đăng ký: Trần Thị B", time: "1 giờ trước", icon: "user" },
        { id: 4, type: "doctor", message: "BS. Lê Văn C cập nhật lịch làm việc", time: "2 giờ trước", icon: "doctor" },
        { id: 5, type: "appointment", message: "Lịch hẹn hoàn thành với BS. Trần Thị Bình", time: "3 giờ trước", icon: "check" },
      ],
      appointmentsByStatus: {
        pending: 1,
        confirmed: 1,
        completed: 1,
        cancelled: 0,
      },
      appointmentsByMonth: [
        { month: "T7", count: 15 },
        { month: "T8", count: 22 },
        { month: "T9", count: 18 },
        { month: "T10", count: 28 },
        { month: "T11", count: 12 },
        { month: "T12", count: 5 },
      ],
    };
    return delay(300, { data: stats });
  },
};

