import axios from "@/lib/axios";
import type {
  Sucursal,
  CreateSucursalDTO,
  UpdateSucursalDTO,
  SucursalLandingData,
} from "@/modules/sucursal";

export const sucursalService = {
  // GET /sucursales
  getAll: async (): Promise<Sucursal[]> => {
    const { data } = await axios.get<Sucursal[]>("/sucursales");
    return data;
  },

  // GET /sucursales/{id}
  getById: async (id: number): Promise<Sucursal> => {
    const { data } = await axios.get<Sucursal>(`/sucursales/${id}`);
    return data;
  },

  // POST /sucursales
  create: async (sucursal: CreateSucursalDTO): Promise<Sucursal> => {
    const { data } = await axios.post<Sucursal>("/sucursales", sucursal);
    return data;
  },

  // PUT /sucursales/{id}
  update: async (
    id: number,
    sucursal: UpdateSucursalDTO
  ): Promise<Sucursal> => {
    const { data } = await axios.put<Sucursal>(`/sucursales/${id}`, sucursal);
    return data;
  },

  // PUT /sucursales/{id}/estado?activa=true
  toggleActive: async (id: number, activa: boolean): Promise<Sucursal> => {
    const { data } = await axios.put<Sucursal>(
      `/sucursales/${id}/estado`,
      null,
      {
        params: { activa },
      }
    );
    return data;
  },

  activate: async (id: number): Promise<Sucursal> => {
    return sucursalService.toggleActive(id, true);
  },

  deactivate: async (id: number): Promise<Sucursal> => {
    return sucursalService.toggleActive(id, false);
  },

  // DELETE /sucursales/{id}
  delete: async (id: number): Promise<void> => {
    await axios.delete(`/sucursales/${id}`);
  },

  // GET /sucursales/{id}
  getLandingData: async (id: number): Promise<SucursalLandingData> => {
    const { data } = await axios.get<SucursalLandingData>(`/sucursales/${id}`);
    return data;
  },
};
