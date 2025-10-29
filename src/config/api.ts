// Simple fake API to simulate backend for development

import type { IDoctor } from "../types/health";

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: { id: string; name: string };
  permissions?: string[];
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

    if (uname.includes("admin")) {
      user = {
        id: "admin",
        email: username,
        name: "Admin Demo",
        role: { id: "admin", name: "Admin" },
        permissions: [
          "view_dashboard",
          "view_profile",
          "view_records",
          "view_family",
          "view_patients",
          "view_appointments",
          "view_prescriptions",
          "view_doctors",
          "create_appointment",
          "create_prescription",
          "transfer_record",
          "create_record",
          "view_doctor_queue",
        ],
      };
      token = "mock-token-admin";
    } else if (uname.includes("doctor")) {
      user = {
        id: "doctor",
        email: username,
        name: "Bác sĩ Demo",
        role: { id: "doctor", name: "Doctor" },
        permissions: [
          "view_dashboard",
          "view_profile",
          "view_records",
          "view_patients",
          "view_appointments",
          "view_prescriptions",
          "view_doctors",
          "view_doctor_queue",
          "create_appointment",
          "create_prescription",
          "mark_record_viewed",
        ],
      };
      token = "mock-token-doctor";
    } else {
      user = {
        id: "user",
        email: username,
        name: "Người Dùng Demo",
        role: { id: "user", name: "User" },
        permissions: [
          "view_dashboard",
          "view_profile",
          "view_records",
          "view_family",
          "view_doctors",
          "view_history",
          "view_appointments",
          "view_doctors",
          "create_record",
          "transfer_record",
        ],
      };
      token = "mock-token-user";
    }

    const response = { data: { access_token: token, user } };
    return delay(600, response);
  },

  getProfile: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return Promise.reject({ message: "No token" });

    let user: IUser;
    if (token === "mock-token-admin") {
      user = {
        id: "admin",
        email: "admin@local",
        name: "Admin Demo",
        role: { id: "admin", name: "Admin" },
        permissions: [
          "view_dashboard",
          "view_profile",
          "view_records",
          "view_family",
          "view_patients",
          "view_appointments",
          "view_prescriptions",
          "view_doctors",
          "create_appointment",
          "create_prescription",
          "transfer_record",
          "create_record",
          "view_doctor_queue",
        ],
      };
    } else if (token === "mock-token-doctor") {
      user = {
        id: "doctor",
        email: "doctor@local",
        name: "Bác sĩ Demo",
        role: { id: "doctor", name: "Doctor" },
        permissions: [
          "view_dashboard",
          "view_profile",
          "view_records",
          "view_patients",
          "view_appointments",
          "view_prescriptions",
          "view_doctors",
          "view_doctor_queue",
          "create_appointment",
          "create_prescription",
          "mark_record_viewed",
        ],
      };
    } else {
      user = {
        id: "user",
        email: "user@local",
        name: "Người Dùng Demo",
        role: { id: "user", name: "User" },
        permissions: [
          "view_dashboard",
          "view_profile",
          "view_records",
          "view_family",
          "view_doctors",
          "create_record",
          "transfer_record",
          "view_appointments",
        ],
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
};
