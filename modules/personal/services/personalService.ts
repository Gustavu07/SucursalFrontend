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

  create: async (
    sucursalId: number,
    data: CreatePersonalDTO
  ): Promise<Personal> => {
    const response = await axiosInstance.post(`/personal/${sucursalId}`, data);
    return response.data;
  },

  update: async (id: number, data: UpdatePersonalDTO): Promise<Personal> => {
    const response = await axiosInstance.put(`/personal/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/personal/${id}`);
  },

  asignarSucursal: async (
    id: number,
    sucursalId: number
  ): Promise<Personal> => {
    const response = await axiosInstance.put(`/personal/${id}/asignar`, null, {
      params: { sucursalId },
    });
    return response.data;
  },

  reasignarSucursal: async (
    id: number,
    nuevaSucursalId: number
  ): Promise<Personal> => {
    const response = await axiosInstance.put(
      `/personal/${id}/reasignar`,
      null,
      {
        params: { nuevaSucursalId },
      }
    );
    return response.data;
  },
};
