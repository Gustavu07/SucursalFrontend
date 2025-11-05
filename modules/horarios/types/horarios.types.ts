export interface Horario {
  id: number;
  diaSemana: DayOfWeek;
  horaApertura: string; // "HH:mm" formato LocalTime
  horaCierre: string; // "HH:mm" formato LocalTime
  sucursalId?: number; // Opcional para cuando viene en nested
}

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface CreateHorarioDTO {
  diaSemana: DayOfWeek;
  horaApertura: string; // "HH:mm"
  horaCierre: string; // "HH:mm"
  sucursalId: number;
}

export interface UpdateHorarioDTO {
  diaSemana?: DayOfWeek;
  horaApertura?: string;
  horaCierre?: string;
}
