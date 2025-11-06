"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Select,
  SelectItem,
  addToast,
} from '@heroui/react';
import {
  ClockIcon,
  CalendarIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { Horario, CreateHorarioDTO, UpdateHorarioDTO, useHorarioMutations, DayOfWeek } from "@/modules/horarios";
import { useSucursales } from "@/modules/sucursal";

interface HorarioFormProps {
  horario?: Horario;
}

// Opciones de días
const DIAS_SEMANA: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];

export function HorarioForm({ horario }: HorarioFormProps) {
  const router = useRouter();
  const isEditMode = !!horario?.id;
  
  const { createAsync, updateAsync, isCreating, isUpdating, createError, updateError } = useHorarioMutations();
  const { sucursales, isLoading: loadingSucursales } = useSucursales();

  const [formData, setFormData] = useState({
    diaSemana: horario?.diaSemana || '' as DayOfWeek,
    horaApertura: horario?.horaApertura || '',
    horaCierre: horario?.horaCierre || '',
    sucursalId: horario?.sucursalId?.toString() || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.diaSemana) {
      newErrors.diaSemana = 'El día de la semana es requerido';
    }

    if (!formData.horaApertura) {
      newErrors.horaApertura = 'La hora de apertura es requerida';
    }

    if (!formData.horaCierre) {
      newErrors.horaCierre = 'La hora de cierre es requerida';
    }

    // Validar que la hora de cierre sea después de la apertura
    if (formData.horaApertura && formData.horaCierre) {
      const [horaA, minA] = formData.horaApertura.split(':').map(Number);
      const [horaC, minC] = formData.horaCierre.split(':').map(Number);
      
      const minutosApertura = horaA * 60 + minA;
      const minutosCierre = horaC * 60 + minC;
      
      if (minutosCierre <= minutosApertura) {
        newErrors.horaCierre = 'La hora de cierre debe ser posterior a la de apertura';
      }
    }

    // Validar sucursal requerida solo al crear
    if (!isEditMode && !formData.sucursalId) {
      newErrors.sucursalId = 'La sucursal es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    router.push('/horarios');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        title: 'Formulario incompleto',
        description: 'Por favor completa todos los campos requeridos.',
        variant: 'solid',
      });
      return;
    }

    try {
      if (isEditMode) {
        const updateData: UpdateHorarioDTO = {
          diaSemana: formData.diaSemana,
          horaApertura: formData.horaApertura,
          horaCierre: formData.horaCierre,
        };
        
        await updateAsync({ id: horario.id, data: updateData });
        addToast({
          title: 'Horario actualizado',
          description: 'Los datos se han actualizado correctamente.',
          variant: 'solid',
        });
      } else {
        const createData: CreateHorarioDTO = {
          diaSemana: formData.diaSemana,
          horaApertura: formData.horaApertura,
          horaCierre: formData.horaCierre,
          sucursalId: Number(formData.sucursalId),
        };
        
        await createAsync({
          sucursalId: Number(formData.sucursalId),
          data: createData,
        });
        
        addToast({
          title: 'Horario creado',
          description: 'El horario se ha registrado correctamente.',
          variant: 'solid',
        });
      }
      router.push('/horarios');
    } catch (error) {
      console.error('Error al guardar:', error);
      addToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Hubo un problema al guardar los datos.',
        variant: 'solid',
      });
    }
  };

  const loading = isCreating || isUpdating;
  const error = createError || updateError;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Editar Horario' : 'Nuevo Horario'}
        </h1>
        <p className="text-sm text-default-500">
          {isEditMode
            ? 'Modifica el horario de atención'
            : 'Completa la información para registrar un nuevo horario'}
        </p>
      </div>

      <Form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Card className="bg-danger-50 border-danger-200">
            <CardBody>
              <p className="text-danger text-sm">{error}</p>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Información del Horario</h3>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <Select
              isRequired
              label="Día de la semana"
              labelPlacement="outside"
              placeholder="Selecciona un día"
              selectedKeys={formData.diaSemana ? [formData.diaSemana] : []}
              onChange={(e) =>
                setFormData({ ...formData, diaSemana: e.target.value as DayOfWeek })
              }
              startContent={<CalendarIcon className="w-4 h-4 text-default-400" />}
              isInvalid={!!errors.diaSemana}
              errorMessage={errors.diaSemana}
            >
              {DIAS_SEMANA.map((dia) => (
                <SelectItem key={dia.value}>
                  {dia.label}
                </SelectItem>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                isRequired
                type="time"
                label="Hora de Apertura"
                labelPlacement="outside"
                value={formData.horaApertura}
                onChange={(e) =>
                  setFormData({ ...formData, horaApertura: e.target.value })
                }
                isInvalid={!!errors.horaApertura}
                errorMessage={errors.horaApertura}
                startContent={<ClockIcon className="w-4 h-4 text-success" />}
              />

              <Input
                isRequired
                type="time"
                label="Hora de Cierre"
                labelPlacement="outside"
                value={formData.horaCierre}
                onChange={(e) =>
                  setFormData({ ...formData, horaCierre: e.target.value })
                }
                isInvalid={!!errors.horaCierre}
                errorMessage={errors.horaCierre}
                startContent={<ClockIcon className="w-4 h-4 text-danger" />}
              />
            </div>

            {formData.horaApertura && formData.horaCierre && !errors.horaCierre && (
              <div className="bg-primary-50 p-3 rounded-lg">
                <p className="text-sm text-primary-700">
                  <strong>Duración:</strong> {(() => {
                    const [horaA, minA] = formData.horaApertura.split(':').map(Number);
                    const [horaC, minC] = formData.horaCierre.split(':').map(Number);
                    const minutosApertura = horaA * 60 + minA;
                    const minutosCierre = horaC * 60 + minC;
                    const duracionMinutos = minutosCierre - minutosApertura;
                    const horas = Math.floor(duracionMinutos / 60);
                    const minutos = duracionMinutos % 60;
                    return minutos > 0 ? `${horas} horas y ${minutos} minutos` : `${horas} horas`;
                  })()}
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Asignación</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <Select
              isRequired={!isEditMode}
              label="Sucursal"
              labelPlacement="outside"
              placeholder="Selecciona una sucursal"
              selectedKeys={formData.sucursalId ? [formData.sucursalId] : []}
              onChange={(e) =>
                setFormData({ ...formData, sucursalId: e.target.value })
              }
              startContent={<BuildingOfficeIcon className="w-4 h-4 text-default-400" />}
              isInvalid={!!errors.sucursalId}
              errorMessage={errors.sucursalId}
              isDisabled={loadingSucursales || isEditMode}
              description={isEditMode ? "No se puede cambiar la sucursal desde aquí" : undefined}
            >
              {sucursales.map((sucursal) => (
                <SelectItem key={sucursal.id.toString()}>
                  {sucursal.direccion}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between mt-4">
          <Button
            color="primary"
            type="submit"
            isLoading={loading}
            isDisabled={loading}
          >
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </Button>
          <Button
            type="button"
            color="danger"
            variant="light"
            onPress={handleCancel}
            isDisabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
}