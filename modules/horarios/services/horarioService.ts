import axiosInstance from "@/lib/axios";
import type {
  Horario,
  CreateHorarioDTO,
  UpdateHorarioDTO,
} from "@/modules/horarios";

export const personalService = {
  getAll: async (): Promise<Horario[]> => {
    const response = await axiosInstance.get("/personal");
    return response.data;
  },

  getById: async (id: number): Promise<Horario> => {
    const response = await axiosInstance.get(`/personal/${id}`);
    return response.data;
  },

  create: async (data: CreateHorarioDTO): Promise<Horario> => {
    const response = await axiosInstance.post("/personal", data);
    return response.data;
  },

  update: async (id: number, data: UpdateHorarioDTO): Promise<Horario> => {
    const response = await axiosInstance.put(`/personal/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/personal/${id}`);
  },

  //falta cambiar esto de aqui
  asignarSucursal: async (id: number, sucursalId: number): Promise<Horario> => {
    const response = await axiosInstance.put(`/personal/${id}/sucursal`, null, {
      params: { sucursalId },
    });
    return response.data;
  },
};
