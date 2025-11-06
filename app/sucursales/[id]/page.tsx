"use client";

import { use } from "react";
import { Spinner } from "@heroui/react";
import { SucursalForm, useSucursalDetail } from "@/modules/sucursal";

export default function EditarSucursalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { sucursal, isLoading } = useSucursalDetail(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Cargando sucursal..." />
      </div>
    );
  }

  if (!sucursal) {
    return (
      <div className="container max-w-7xl mx-auto py-10">
        <p className="text-danger">Sucursal no encontrada</p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10">
      <SucursalForm sucursal={sucursal} />
    </div>
  );
}