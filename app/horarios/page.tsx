import { Divider } from "@heroui/react";
import { HorarioWrapper } from "@/modules/horarios";

export default function HorarioPage() {
  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">Horarios</h2>
      </div>
      <Divider className="my-6" />
      <HorarioWrapper />
    </div>
  );
}