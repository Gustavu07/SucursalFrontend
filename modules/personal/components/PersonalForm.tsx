"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, CardBody, CardHeader, Divider, Chip, Select, SelectItem, addToast } from '@heroui/react';
import { UserIcon, EnvelopeIcon, PhoneIcon, PlusIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Personal, CreatePersonalDTO, UpdatePersonalDTO, usePersonalMutations } from "@/modules/personal";
import { useSucursales } from "@/modules/sucursal";

interface PersonalFormProps {
  personal?: Personal;
}

export function PersonalForm({ personal }: PersonalFormProps) {
  const router = useRouter();
  const isEditMode = !!personal?.id;
  
  const { createAsync, updateAsync, isCreating, isUpdating, createError, updateError } = usePersonalMutations();
  const { sucursales, isLoading: loadingSucursales } = useSucursales();

  const [formData, setFormData] = useState({
    nombreCompleto: personal?.nombreCompleto || '',
    correoInstitucional: personal?.correoInstitucional || '',
    numeroCorporativo: personal?.numeroCorporativo || '',
    sucursalId: personal?.sucursalId?.toString() || '',
  });

  const [numerosTelefono, setNumerosTelefono] = useState<string[]>(
    personal?.numerosTelefono || []
  );
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es requerido';
    }

    if (!formData.correoInstitucional.trim()) {
      newErrors.correoInstitucional = 'El correo institucional es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoInstitucional)) {
      newErrors.correoInstitucional = 'Correo electrónico inválido';
    }

    // ✅ AGREGADO: Validar sucursal requerida solo al crear
    if (!isEditMode && !formData.sucursalId) {
      newErrors.sucursalId = 'La sucursal es requerida';
    }

    // ✅ AGREGADO: Validar al menos un teléfono
    if (numerosTelefono.length === 0) {
      newErrors.numerosTelefono = 'Debe agregar al menos un número de teléfono';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTelefono = () => {
    if (nuevoTelefono.trim() && /^\d{7,15}$/.test(nuevoTelefono.replace(/\s/g, ''))) {
      setNumerosTelefono([...numerosTelefono, nuevoTelefono.trim()]);
      setNuevoTelefono('');
      // Limpiar error de teléfonos si existía
      if (errors.numerosTelefono) {
        setErrors({ ...errors, numerosTelefono: '' });
      }
    }
  };

  const handleRemoveTelefono = (index: number) => {
    setNumerosTelefono(numerosTelefono.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    router.push('/personal');
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
        // ✅ CORREGIDO: UpdatePersonalDTO sin sucursalId
        const updateData: UpdatePersonalDTO = {
          nombreCompleto: formData.nombreCompleto,
          correoInstitucional: formData.correoInstitucional,
          numerosTelefono,
          numeroCorporativo: formData.numeroCorporativo || null,
        };
        
        await updateAsync({ id: personal.id, data: updateData });
        addToast({
          title: 'Personal actualizado',
          description: 'Los datos se han actualizado correctamente.',
          variant: 'solid',
        });
      } else {
        const createData: CreatePersonalDTO = {
          nombreCompleto: formData.nombreCompleto,
          correoInstitucional: formData.correoInstitucional,
          numerosTelefono,
          sucursalId: Number(formData.sucursalId), // Ya validamos que existe
        };
        
        await createAsync({
          sucursalId: Number(formData.sucursalId),
          data: createData,
        });
        
        addToast({
          title: 'Personal creado',
          description: 'El personal se ha registrado correctamente.',
          variant: 'solid',
        });
      }
      router.push('/personal');
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Editar Personal' : 'Nuevo Personal'}
        </h1>
        <p className="text-sm text-default-500">
          {isEditMode
            ? `Modifica los datos de: ${personal.nombreCompleto}`
            : 'Completa la información para registrar un nuevo miembro del personal'}
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
            <h3 className="text-lg font-semibold">Información Personal</h3>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <Input
              isRequired
              label="Nombre Completo"
              labelPlacement="outside"
              placeholder="Juan Pérez García"
              value={formData.nombreCompleto}
              onChange={(e) =>
                setFormData({ ...formData, nombreCompleto: e.target.value })
              }
              isInvalid={!!errors.nombreCompleto}
              errorMessage={errors.nombreCompleto}
              startContent={<UserIcon className="w-4 h-4 text-default-400" />}
            />

            <Input
              isRequired
              type="email"
              label="Correo Institucional"
              labelPlacement="outside"
              placeholder="juan.perez@empresa.com"
              value={formData.correoInstitucional}
              onChange={(e) =>
                setFormData({ ...formData, correoInstitucional: e.target.value })
              }
              isInvalid={!!errors.correoInstitucional}
              errorMessage={errors.correoInstitucional}
              startContent={<EnvelopeIcon className="w-4 h-4 text-default-400" />}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Teléfonos de Contacto</h3>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="flex gap-2">
              <Input
                label="Agregar teléfono"
                labelPlacement="outside"
                placeholder="12345678"
                value={nuevoTelefono}
                onChange={(e) => setNuevoTelefono(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTelefono())}
                startContent={<PhoneIcon className="w-4 h-4 text-default-400" />}
                isInvalid={!!errors.numerosTelefono}
                errorMessage={errors.numerosTelefono}
              />
              <Button
                color="primary"
                variant="flat"
                onPress={handleAddTelefono}
                isIconOnly
                className="mt-6"
              >
                <PlusIcon className="w-5 h-5" />
              </Button>
            </div>

            {numerosTelefono.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {numerosTelefono.map((tel, index) => (
                  <Chip
                    key={index}
                    onClose={() => handleRemoveTelefono(index)}
                    variant="flat"
                    color="primary"
                  >
                    {tel}
                  </Chip>
                ))}
              </div>
            ) : (
              <p className="text-sm text-default-400">
                No hay teléfonos agregados
              </p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Asignación</h3>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
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

            <Input
              label="Número Corporativo"
              labelPlacement="outside"
              placeholder="1234 (opcional)"
              value={formData.numeroCorporativo}
              onChange={(e) =>
                setFormData({ ...formData, numeroCorporativo: e.target.value })
              }
              description="Solo si está asignado a una sucursal"
              startContent={<PhoneIcon className="w-4 h-4 text-default-400" />}
            />
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