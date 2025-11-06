"use client";

import { useParams } from "next/navigation";
import { Spinner } from "@heroui/react";
import { HorarioForm, useHorarioById } from "@/modules/horarios";

export default function EditarHorarioPage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;

  const { horario, isLoading, isError, error } = useHorarioById(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Cargando horario..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container max-w-7xl mx-auto py-10">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!horario) {
    return (
      <div className="container max-w-7xl mx-auto py-10">
        <p className="text-danger">Horario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10">
      <HorarioForm horario={horario} />
    </div>
  );
}
