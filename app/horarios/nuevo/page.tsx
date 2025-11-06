import { Divider } from "@heroui/react";
import { HorarioForm } from "@/modules/horarios";

export default function NuevoHorarioPage() {
  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">Nuevo horario</h2>
      </div>
      <Divider className="my-6" />
      {/* HorarioForm debe manejar modo creación cuando no recibe prop `horario` */}
      <HorarioForm />
    </div>
  );
}