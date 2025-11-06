import axiosInstance from "@/lib/axios";
import type {
  Personal,
  CreatePersonalDTO,
  UpdatePersonalDTO,
} from "@/modules/personal";

export const personalService = {
  getAll: async (): Promise<Personal[]> => {
    const response = await axiosInstance.get("/personal");
    return response.data;
  },

  getById: async (id: number): Promise<Personal> => {
    const response = await axiosInstance.get(`/personal/${id}`);
    return response.data;
  },

  create: async (data: CreatePersonalDTO): Promise<Personal> => {
    const response = await axiosInstance.post("/personal", data);
    return response.data;
  },

  update: async (id: number, data: UpdatePersonalDTO): Promise<Personal> => {
    const response = await axiosInstance.put(`/personal/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/personal/${id}`);
  },

  // Asignar o reasignar a sucursal
  asignarSucursal: async (
    id: number,
    sucursalId: number
  ): Promise<Personal> => {
    const response = await axiosInstance.put(`/personal/${id}/sucursal`, null, {
      params: { sucursalId },
    });
    return response.data;
  },
};
