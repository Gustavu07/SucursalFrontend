import { Divider } from "@heroui/react";
import { PersonalWrapper } from "@/modules/personal";

/**
 * Página principal de Personales.
 * Es un Server Component para la optimización de Next.js.
 * Delega la interactividad a PersonalWrapper.
 */
export default function PersonalPage() {
  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">Personal</h2>
      </div>
      <Divider className="my-6" />
      <PersonalWrapper />
    </div>
  );
}