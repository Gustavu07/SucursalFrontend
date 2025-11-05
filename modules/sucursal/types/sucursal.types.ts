import { Horario } from "@/modules/horarios";
import { Personal } from "@/modules/personal";

export interface Sucursal {
  id: number;
  direccion: string;
  telefono: string;
  latitud: number;
  longitud: number;
  imagenUrl?: string; // Para mostrar en la landing
  activa: boolean;
  numerosContacto: string[];
  horarios: Horario[];
  personal: Personal[];
}

export interface CreateSucursalDTO {
  direccion: string;
  telefono: string;
  latitud: number;
  longitud: number;
  imagenUrl?: string;
  numerosContacto: string[];
}

export interface UpdateSucursalDTO {
  direccion?: string;
  telefono?: string;
  latitud?: number;
  longitud?: number;
  imagenUrl?: string;
  activa?: boolean;
  numerosContacto?: string[];
}

export interface SucursalLandingData extends Sucursal {
  horarios: Horario[];
  numerosContacto: string[];
  personalVisible?: PersonalPublico[];
}

export interface PersonalPublico {
  id: number;
  nombreCompleto: string;
  cargo?: string;
}
