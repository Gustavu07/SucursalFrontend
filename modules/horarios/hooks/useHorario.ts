"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateHorarioDTO,
  UpdateHorarioDTO,
  horarioService,
} from "@/modules/horarios";

const QUERY_KEY = "horarios";

/**
 * Hook para listar todos los horarios.
 */
export function useHorario() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: horarioService.getAll,
  });

  return {
    horarios: data || [],
    isLoading,
    isError: !!error,
    error: error?.message,
    refresh: refetch,
  };
}

/**
 * Hook para listar los horarios de una sucursal específica.
 */
export function useHorarioBySucursal(sucursalId: number | null) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, "sucursal", sucursalId],
    queryFn: () => horarioService.getBySucursal(sucursalId!),
    enabled: !!sucursalId,
  });

  return {
    horarios: data || [],
    isLoading,
    isError: !!error,
    error: error?.message,
    refresh: refetch,
  };
}
export function useHorarioById(id: number | null) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => horarioService.getById(id!),
    enabled: !!id, // solo se ejecuta si el id es válido
  });

  return {
    horario: data ?? null,
    isLoading,
    isError: !!error,
    error: error?.message,
    refresh: refetch,
  };
}

/**
 * Hook para gestionar operaciones de creación, edición y eliminación de horarios.
 */
export function useHorarioMutations() {
  const queryClient = useQueryClient();

  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  };

  const createMutation = useMutation({
    mutationFn: ({
      sucursalId,
      data,
    }: {
      sucursalId: number;
      data: CreateHorarioDTO;
    }) => horarioService.create(sucursalId, data),
    onSuccess: () => invalidateCache(),
    onError: (error) => console.error("Error creando horario:", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHorarioDTO }) =>
      horarioService.update(id, data),
    onSuccess: () => invalidateCache(),
    onError: (error) => console.error("Error actualizando horario:", error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => horarioService.delete(id),
    onSuccess: () => invalidateCache(),
    onError: (error) => console.error("Error eliminando horario:", error),
  });

  return {
    // Crear
    createAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message,

    // Editar
    updateAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error?.message,

    // Eliminar
    remove: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error?.message,

    // Estado global de carga
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}
