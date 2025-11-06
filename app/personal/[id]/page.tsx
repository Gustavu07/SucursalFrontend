"use client";

import { use } from "react";
import { Spinner } from "@heroui/react";
import { PersonalForm, usePersonalDetail } from "@/modules/personal";

export default function EditarSucursalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { personal, isLoading } = usePersonalDetail(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Cargando sucursal..." />
      </div>
    );
  }

  if (!personal) {
    return (
      <div className="container max-w-7xl mx-auto py-10">
        <p className="text-danger">Personal no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10">
      <PersonalForm personal={personal} />
    </div>
  );
}