import axiosInstance from "../config/axios";

export interface IUserNew {
  id: number;
  fullName?: string;
  email: string;
  phone: string;
  roleName: string;
  active: number; // 0 = inactive, 1 = active
}

export interface UserListMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface UserListResponse {
  code: number;
  message: string;
  data: {
    meta: UserListMeta;
    result: IUserNew[];
  };
}

export interface UserListParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface CreateUserDTO {
  phone: string;
  password: string;
  roleId: number; // 1 = Admin, 4 = Patient_Household
  isActive: boolean;
  memberInfo?: {
    fullName: string;
    address: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    dateOfBirth: string; // YYYY-MM-DD
    cccd: string;
    bhyt?: string | null;
  };
}

export const userService = {
  async getList(params?: UserListParams): Promise<UserListResponse> {
    try {
      const response = await axiosInstance.get<UserListResponse>(
        "/users/getAll",
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async create(data: CreateUserDTO): Promise<{ code: number; message: string }> {
    const response = await axiosInstance.post("/users/register", data);
    return response.data;
  },

  async delete(id: number): Promise<{ code: number; message: string }> {
    const response = await axiosInstance.delete(`/users/delete/${id}`);
    return response.data;
  },
};
