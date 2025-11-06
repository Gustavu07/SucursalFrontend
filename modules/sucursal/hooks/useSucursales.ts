"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sucursalService } from "@/modules/sucursal";
import type { CreateSucursalDTO, UpdateSucursalDTO } from "@/modules/sucursal";

const QUERY_KEY = "sucursales";

export function useSucursales() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: sucursalService.getAll,
  });

  return {
    sucursales: data || [],
    isLoading,
    isError: !!error,
    error: error?.message,
    refresh: refetch,
  };
}

export function useSucursalDetail(id: number | null) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => sucursalService.getById(id!),
    enabled: !!id, // Solo ejecuta si hay ID
  });

  return {
    sucursal: data,
    isLoading,
    isError: !!error,
    error: error?.message,
    refresh: refetch,
  };
}
export function useSucursalMutations() {
  const queryClient = useQueryClient();

  // Invalidar cache después de mutaciones
  const invalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  };

  // CREATE
  const createMutation = useMutation({
    mutationFn: (data: CreateSucursalDTO) => sucursalService.create(data),
    onSuccess: () => {
      invalidateCache();
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSucursalDTO }) =>
      sucursalService.update(id, data),
    onSuccess: () => {
      invalidateCache();
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (id: number) => sucursalService.delete(id),
    onSuccess: () => {
      invalidateCache();
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, activa }: { id: number; activa: boolean }) =>
      sucursalService.toggleActive(id, activa),
    onSuccess: () => {
      invalidateCache();
    },
  });

  return {
    create: createMutation.mutate,
    createAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message,

    update: updateMutation.mutate,
    updateAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error?.message,

    remove: deleteMutation.mutate,
    removeAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error?.message,

    toggleActive: toggleActiveMutation.mutate,
    toggleActiveAsync: toggleActiveMutation.mutateAsync,
    isToggling: toggleActiveMutation.isPending,
    toggleError: toggleActiveMutation.error?.message,

    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      toggleActiveMutation.isPending,
  };
}

export function useSucursalLanding(id: number | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sucursal-landing", id],
    queryFn: () => sucursalService.getLandingData(id!),
    enabled: !!id,
  });

  return {
    landingData: data,
    isLoading,
    isError: !!error,
    error: error?.message,
  };
}
