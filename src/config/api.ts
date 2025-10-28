// Simple fake API to simulate backend for development

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
          "create_record",
          "transfer_record",
          "view_appointments",
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
        healthStatus: "Good",
      },
      {
        id: "m2",
        name: "Trần Thị B",
        relation: "Vợ",
        dob: "1987-03-05",
        healthStatus: "Good",
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
        facility: "Phòng khám A",
        doctor: "Bác sĩ X",
        datetime: "2025-11-01T09:00:00",
        status: "pending",
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
};
