"use client";

import { useSearchParams } from "next/navigation";
import { Spinner, Card, CardBody, Chip } from "@heroui/react";
import { MapPinIcon, PhoneIcon, ClockIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useSucursalLanding } from "@/modules/sucursal";
import Image from "next/image";

export default function Home() {
  const searchParams = useSearchParams();
  const sucursalId = searchParams.get("sucursal");

  const { landingData, isLoading } = useSucursalLanding(
    sucursalId ? Number(sucursalId) : null
  );

  // --- Sin ID seleccionado ---
  if (!sucursalId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BuildingOfficeIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Selecciona una sucursal</h1>
          <p className="text-gray-500">Ejemplo: /?sucursal=1</p>
        </div>
      </div>
    );
  }

  // --- Cargando ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Cargando sucursal..." />
      </div>
    );
  }

  // --- Sin datos ---
  if (!landingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-danger text-lg font-semibold">Sucursal no encontrada</p>
      </div>
    );
  }

  // --- Contenido ---
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-10 space-y-10">

        {/* 🏢 Sección 1: Hero */}
        <section className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
          {landingData.imagenUrl ? (
            <Image
              src={landingData.imagenUrl}
              alt={landingData.direccion}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <BuildingOfficeIcon className="w-32 h-32 text-white opacity-50" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="p-8 text-white w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{landingData.direccion}</h1>
                  <p className="text-lg opacity-90">Bienvenido a nuestra sucursal</p>
                </div>
                {landingData.activa ? (
                  <Chip color="success" size="lg">Activa</Chip>
                ) : (
                  <Chip color="default" size="lg">Inactiva</Chip>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ☎️ Sección 2: Contacto */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <PhoneIcon className="w-8 h-8 text-primary" />
            Contáctanos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4">Teléfono Principal</h3>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-6 h-6 text-primary" />
                  <a
                    href={`tel:${landingData.telefono}`}
                    className="text-2xl font-bold text-primary hover:underline"
                  >
                    {landingData.telefono}
                  </a>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4">Números Adicionales</h3>
                {landingData.numerosContacto?.length > 0 ? (
                  <div className="space-y-2">
                    {landingData.numerosContacto.map((numero, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <PhoneIcon className="w-5 h-5 text-gray-500" />
                        <a
                          href={`tel:${numero}`}
                          className="text-lg hover:text-primary hover:underline"
                        >
                          {numero}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No hay números adicionales</p>
                )}
              </CardBody>
            </Card>
          </div>
        </section>

        {/* ⏰ Sección 3: Horarios */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <ClockIcon className="w-8 h-8 text-primary" />
            Horarios de Atención
          </h2>
          <Card>
            <CardBody className="p-6">
              {landingData.horarios && landingData.horarios.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {landingData.horarios.map((horario) => (
                    <div
                      key={horario.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="font-semibold text-lg">
                        {horario.diaSemana}
                      </span>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>{horario.horaApertura}</span>
                        <span>-</span>
                        <span>{horario.horaCierre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">
                  No hay horarios disponibles
                </p>
              )}
            </CardBody>
          </Card>
        </section>

        {/* 📍 Sección 4: Ubicación */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <MapPinIcon className="w-8 h-8 text-primary" />
            Nuestra Ubicación
          </h2>
          <Card>
            <CardBody className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Dirección</h3>
                  <p className="text-lg mb-4">{landingData.direccion}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">Latitud:</span>
                      <span>{landingData.latitud.toFixed(6)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">Longitud:</span>
                      <span>{landingData.longitud.toFixed(6)}</span>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${landingData.latitud},${landingData.longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition"
                  >
                    Abrir en Google Maps
                  </a>
                </div>

                <div className="h-[300px] rounded-lg overflow-hidden">
                  <iframe
                    src={`https://maps.google.com/maps?q=${landingData.latitud},${landingData.longitud}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </main>
  );
}
