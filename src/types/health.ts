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
  id: string;
  facility: string;
  doctor?: string;
  datetime: string; // ISO
  patientName?: string;
  reason?: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  note?: string;
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
