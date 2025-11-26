import axiosInstance from "../config/axios";

// Type definitions based on API response
export interface IFamilyMemberNew {
  id: number;
  fullname: string;
  idCard: string;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string; // ISO date string
  email: string | null;
  relation: "CHU_HO" | "VO" | "CHONG" | "CON" | "BO" | "ME";
  bhyt: string | null;
  household: {
    id: number;
    househeadId: number;
    address: string;
    quantity: number;
    isActive: boolean;
  };
}

export interface FamilyListMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface FamilyListResponse {
  code: number;
  message: string;
  data: {
    meta: FamilyListMeta;
    result: IFamilyMemberNew[];
  };
}

export interface FamilyListParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface CreateMemberDTO {
  fullname: string;
  idCard: string;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string; // YYYY-MM-DD
  email?: string;
  relation: "CHU_HO" | "VO_CHONG" | "CON" | "CHA_ME" | "ANH_CHI_EM" | "ONG_BA" | "KHAC";
  bhyt?: string;
  user_account?: {
    roleId: number;
    phone: string;
    password: string;
  };
}

export const familyService = {
  async getList(params?: FamilyListParams): Promise<FamilyListResponse> {
    try {
      const response = await axiosInstance.get<FamilyListResponse>(
        "/members/families",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching family members:", error);
      throw error;
    }
  },

  async getById(id: number): Promise<{ code: number; message: string; data: IFamilyMemberNew }> {
    const response = await axiosInstance.get(`/members/get/${id}`);
    return response.data;
  },

  async create(data: CreateMemberDTO): Promise<{ code: number; message: string; data: number }> {
    const response = await axiosInstance.post("/members/create", data);
    return response.data;
  },

  async update(id: number, data: any): Promise<{ code: number; message: string }> {
    const response = await axiosInstance.put(`/members/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<{ code: number; message: string }> {
    const response = await axiosInstance.delete(`/members/update/${id}`);
    return response.data;
  },
};

// Helper function to map relation enum to Vietnamese
export const getRelationText = (relation: string): string => {
  const relationMap: Record<string, string> = {
    CHU_HO: "Chủ hộ",
    VO: "Vợ",
    CHONG: "Chồng",
    CON: "Con",
    BO: "Bố",
    ME: "Mẹ",
  };
  return relationMap[relation] || relation;
};

// Helper function to map gender enum to Vietnamese
export const getGenderText = (gender: string): string => {
  const genderMap: Record<string, string> = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
  };
  return genderMap[gender] || gender;
};
