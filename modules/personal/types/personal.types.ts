import { Sucursal } from "@/modules/sucursal";

export interface Personal {
  id: number;
  nombreCompleto: string;
  correoInstitucional: string;
  numerosTelefono: string[];
  numeroCorporativo?: string | null;
  sucursalId?: number; // Opcional para cuando viene en nested
  sucursal?: Sucursal; // Opcional para datos completos
}

export interface CreatePersonalDTO {
  nombreCompleto: string;
  correoInstitucional: string;
  numerosTelefono: string[];
  sucursalId: number;
}

export interface UpdatePersonalDTO {
  nombreCompleto?: string;
  correoInstitucional?: string;
  numerosTelefono?: string[];
  numeroCorporativo?: string | null;
}

export interface ReasignarPersonalDTO {
  nuevoSucursalId: number;
  // IMPORTANTE: El numeroCorporativo se eliminará automáticamente
}

export interface AsignarNumeroCorporativoDTO {
  personalId: number;
  numeroCorporativo: string;
}
