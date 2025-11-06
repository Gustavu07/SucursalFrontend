"use client";

import { useState } from "react";
import {  Input,  Button,  Card,  CardBody,  CardHeader,  Divider,  Chip,} from '@heroui/react';
import {  MapPinIcon,  PhoneIcon,  PlusIcon} from '@heroicons/react/24/outline';
import { Sucursal, CreateSucursalDTO, UpdateSucursalDTO, useSucursalMutations } from "@/modules/sucursal";


interface SucursalFormProps {
  sucursal?: Sucursal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SucursalForm({ sucursal, onSuccess, onCancel }: SucursalFormProps) {
  const isEditing = !!sucursal?.id;
  const { create, update, isCreating, isUpdating, createError, updateError } =
    useSucursalMutations();

  // Form state
  const [formData, setFormData] = useState({
    direccion: sucursal?.direccion || '',
    telefono: sucursal?.telefono || '',
    latitud: sucursal?.latitud?.toString() || '',
    longitud: sucursal?.longitud?.toString() || '',
    imagenUrl: sucursal?.imagenUrl || '',
  });

  const [numerosContacto, setNumerosContacto] = useState<string[]>(
  sucursal?.numerosContacto || [] );
  const [nuevoContacto, setNuevoContacto] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{7,15}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Teléfono inválido (7-15 dígitos)';
    }

    if (!formData.latitud) {
      newErrors.latitud = 'La latitud es requerida';
    } else if (
      isNaN(Number(formData.latitud)) ||
      Number(formData.latitud) < -90 ||
      Number(formData.latitud) > 90
    ) {
      newErrors.latitud = 'Latitud inválida (-90 a 90)';
    }

    if (!formData.longitud) {
      newErrors.longitud = 'La longitud es requerida';
    } else if (
      isNaN(Number(formData.longitud)) ||
      Number(formData.longitud) < -180 ||
      Number(formData.longitud) > 180
    ) {
      newErrors.longitud = 'Longitud inválida (-180 a 180)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContacto = () => {
    if (nuevoContacto.trim() && /^\d{7,15}$/.test(nuevoContacto.replace(/\s/g, ''))) {
      setNumerosContacto([...numerosContacto, nuevoContacto.trim()]);
      setNuevoContacto('');
    }
  };

  const handleRemoveContacto = (index: number) => {
    setNumerosContacto(numerosContacto.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data: CreateSucursalDTO | UpdateSucursalDTO = {
      direccion: formData.direccion,
      telefono: formData.telefono,
      latitud: Number(formData.latitud),
      longitud: Number(formData.longitud),
      imagenUrl: formData.imagenUrl || undefined,
      numerosContacto,
    };

    try {
      if (isEditing) {
        await update({ id: sucursal.id, data });
      } else {
        await create(data as CreateSucursalDTO);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const isPending = isCreating || isUpdating;
  const error = createError || updateError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Card className="bg-danger-50 border-danger-200">
          <CardBody>
            <p className="text-danger text-sm">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Información básica */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Información Básica</h3>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          <Input
            label="Dirección"
            placeholder="Av. Principal #123, Zona Centro"
            value={formData.direccion}
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
            }
            isInvalid={!!errors.direccion}
            errorMessage={errors.direccion}
            isRequired
            startContent={<MapPinIcon className="w-4 h-4 text-default-400" />}
          />

          <Input
            label="Teléfono Principal"
            placeholder="12345678"
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
            isInvalid={!!errors.telefono}
            errorMessage={errors.telefono}
            isRequired
            startContent={<PhoneIcon className="w-4 h-4 text-default-400" />}
          />

          <Input
            label="URL de Imagen"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.imagenUrl}
            onChange={(e) =>
              setFormData({ ...formData, imagenUrl: e.target.value })
            }
            description="Imagen para mostrar en la landing"
          />
        </CardBody>
      </Card>

      {/* Ubicación */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Ubicación GPS</h3>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              step="any"
              label="Latitud"
              placeholder="-17.7833"
              value={formData.latitud}
              onChange={(e) =>
                setFormData({ ...formData, latitud: e.target.value })
              }
              isInvalid={!!errors.latitud}
              errorMessage={errors.latitud}
              isRequired
            />

            <Input
              type="number"
              step="any"
              label="Longitud"
              placeholder="-63.1821"
              value={formData.longitud}
              onChange={(e) =>
                setFormData({ ...formData, longitud: e.target.value })
              }
              isInvalid={!!errors.longitud}
              errorMessage={errors.longitud}
              isRequired
            />
          </div>
        </CardBody>
      </Card>

      {/* Números de Contacto */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Números de Contacto</h3>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Agregar número de contacto"
              value={nuevoContacto}
              onChange={(e) => setNuevoContacto(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddContacto())}
            />
            <Button
              color="primary"
              variant="flat"
              onPress={handleAddContacto}
              isIconOnly
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>

          {numerosContacto.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {numerosContacto.map((numero, index) => (
                <Chip
                  key={index}
                  onClose={() => handleRemoveContacto(index)}
                  variant="flat"
                  color="primary"
                >
                  {numero}
                </Chip>
              ))}
            </div>
          )}

          {numerosContacto.length === 0 && (
            <p className="text-sm text-default-400">
              No hay números de contacto agregados
            </p>
          )}
        </CardBody>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="flat" onPress={onCancel} isDisabled={isPending}>
            Cancelar
          </Button>
        )}
        <Button color="primary" type="submit" isLoading={isPending}>
          {isEditing ? 'Actualizar Sucursal' : 'Crear Sucursal'}
        </Button>
      </div>
    </form>
  );
}