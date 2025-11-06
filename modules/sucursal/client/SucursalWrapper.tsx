"use client";

import { Button } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SucursalTable, SucursalDialog } from "@/modules/sucursal";

/**
 * Componente que contiene toda la lógica de cliente para la vista de Sucursales.
 * Esto permite que el componente padre (page.tsx) permanezca en el servidor.
 */
export function SucursalWrapper() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <SucursalDialog>
          <Button color="primary" startContent={<PlusIcon className="h-5 w-5" />}>
            Crear Sucursal
          </Button>
        </SucursalDialog>
      </div>
      <SucursalTable />
    </div>
  );
}