"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SucursalTable } from "@/modules/sucursal";

/**
 * Componente que contiene toda la lógica de cliente para la vista de Sucursales.
 * Esto permite que el componente padre (page.tsx) permanezca en el servidor.
 */
export function SucursalWrapper() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button 
          color="primary" 
          startContent={<PlusIcon className="h-5 w-5" />}
          onPress={() => router.push('/sucursales/nuevo')}
        >
          Crear Sucursal
        </Button>
      </div>
      <SucursalTable />
    </div>
  );
}