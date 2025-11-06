"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { personalService } from "../services/personalService";
import type { CreatePersonalDTO, UpdatePersonalDTO } from "@/modules/personal";

const QUERY_KEY = "personal";

export function usePersonal() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: personalService.getAll,
  });

  return {
    personal: data || [],
    isLoading,
    isError: !!error,
    error: error?.message,
    refresh: refetch,
  };
}

export function usePersonalDetail(id: number | null) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => personalService.getById(id!),
    enabled: !!id,
  });

  return {
    personal: data,
    isLoading,
    isError: !!error,
    error: error?.message,
    refresh: refetch,
  };
}

export function usePersonalMutations() {
  const queryClient = useQueryClient();

  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  };

  // ✅ CORREGIDO: Ahora acepta sucursalId
  const createMutation = useMutation({
    mutationFn: ({
      sucursalId,
      data,
    }: {
      sucursalId: number;
      data: CreatePersonalDTO;
    }) => personalService.create(sucursalId, data),
    onSuccess: () => invalidateCache(),
    onError: (error) => console.error("Error creating personal:", error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePersonalDTO }) =>
      personalService.update(id, data),
    onSuccess: () => invalidateCache(),
    onError: (error) => console.error("Error updating personal:", error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => personalService.delete(id),
    onSuccess: () => invalidateCache(),
    onError: (error) => console.error("Error deleting personal:", error),
  });

  const asignarSucursalMutation = useMutation({
    mutationFn: ({ id, sucursalId }: { id: number; sucursalId: number }) =>
      personalService.asignarSucursal(id, sucursalId),
    onSuccess: () => invalidateCache(),
    onError: (error) => console.error("Error asignando sucursal:", error),
  });

  // ✅ OPCIONAL: Agregar reasignar si lo necesitas
  const reasignarSucursalMutation = useMutation({
    mutationFn: ({
      id,
      nuevaSucursalId,
    }: {
      id: number;
      nuevaSucursalId: number;
    }) => personalService.reasignarSucursal(id, nuevaSucursalId),
    onSuccess: () => invalidateCache(),
    onError: (error) => console.error("Error reasignando sucursal:", error),
  });

  return {
    createAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message,

    updateAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error?.message,

    remove: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error?.message,

    asignarSucursal: asignarSucursalMutation.mutate,
    isAssigning: asignarSucursalMutation.isPending,
    assignError: asignarSucursalMutation.error?.message,

    // ✅ OPCIONAL: Exportar reasignar
    reasignarSucursal: reasignarSucursalMutation.mutate,
    isReassigning: reasignarSucursalMutation.isPending,

    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      asignarSucursalMutation.isPending ||
      reasignarSucursalMutation.isPending,
  };
}
