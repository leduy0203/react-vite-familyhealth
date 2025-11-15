export type Gender = "MALE" | "FEMALE" | "OTHER";

export type Expertise =
  | "TIM_MACH"
  | "HO_HAP"
  | "TIEU_HOA"
  | "NOI_KHOA"
  | "NGOAI_KHOA"
  | "NHI_KHOA"
  | "SAN_PHU_KHOA"
  | "TAI_MUI_HONG"
  | "MAT"
  | "RANG_HAM_MAT"
  | "DA_LIEU"
  | "TAM_THAN"
  | "XUONG_KHOP"
  | "THAN_KINH";

export interface IDoctorNew {
  id: number;
  fullname: string;
  email: string;
  address: string;
  gender: Gender;
  dateOfBirth?: string | null;
  idCard?: string | null;
  expertise: Expertise | string;
  bio: string;
  user_id?: number | null;
}

export interface DoctorListMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface DoctorListResponse {
  code: number;
  message: string;
  data: {
    meta: DoctorListMeta;
    result: IDoctorNew[];
  };
}

export interface DoctorListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
