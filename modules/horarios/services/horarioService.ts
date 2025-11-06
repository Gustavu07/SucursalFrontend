import axiosInstance from "@/lib/axios";
import type {
  Horario,
  CreateHorarioDTO,
  UpdateHorarioDTO,
} from "@/modules/horarios";

/**
 * Servicio para gestionar los horarios.
 * Hace las peticiones HTTP al backend (Spring Boot).
 */
export const horarioService = {
  getAll: async (): Promise<Horario[]> => {
    const response = await axiosInstance.get("/horarios");
    return response.data;
  },

  getBySucursal: async (sucursalId: number): Promise<Horario[]> => {
    const response = await axiosInstance.get(
      `/horarios/sucursal/${sucursalId}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<Horario> => {
    const response = await axiosInstance.get(`/horarios/${id}`);
    return response.data;
  },
  create: async (
    sucursalId: number,
    data: CreateHorarioDTO
  ): Promise<Horario> => {
    const response = await axiosInstance.post(`/horarios/${sucursalId}`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateHorarioDTO): Promise<Horario> => {
    const response = await axiosInstance.put(`/horarios/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/horarios/${id}`);
  },
};
