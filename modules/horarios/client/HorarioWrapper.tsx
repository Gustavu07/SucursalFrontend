"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { HorarioTable } from "@/modules/horarios";

/**
 * Componente que contiene toda la lógica de cliente para la vista de horarios.
 * Esto permite que el componente padre (page.tsx) permanezca en el servidor.
 */
export function HorarioWrapper() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button 
          color="primary" 
          startContent={<PlusIcon className="h-5 w-5" />}
          onPress={() => router.push('/horarios/nuevo')}
        >
          Añadir Horario
        </Button>
      </div>
      <HorarioTable />
    </div>
  );
}
