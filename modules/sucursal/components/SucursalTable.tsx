"use client";

import { useRouter } from 'next/navigation';
import {  Table,  TableHeader,  TableColumn,  TableBody,  TableRow,  TableCell,  Chip,  Tooltip,  Button,  Spinner,} from '@heroui/react';
import {  PencilIcon,  TrashIcon,  EyeIcon,  MapPinIcon,} from '@heroicons/react/24/outline';
import { useSucursales, useSucursalMutations, Sucursal } from "@/modules/sucursal";

interface SucursalTableProps {
  onView?: (sucursal: Sucursal) => void;
}

export function SucursalTable({ onView }: SucursalTableProps) {
  const router = useRouter();
  const { sucursales, isLoading } = useSucursales();
  const { toggleActive, isToggling, remove, isDeleting } = useSucursalMutations();

  const handleToggleActive = (sucursal: Sucursal) => {
    toggleActive({ id: sucursal.id, activa: !sucursal.activa });
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
      remove(id);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/sucursales/${id}`);
  };

  const columns = [
    { key: 'direccion', label: 'DIRECCIÓN' },
    { key: 'telefono', label: 'TELÉFONO' },
    { key: 'ubicacion', label: 'UBICACIÓN' },
    { key: 'contactos', label: 'CONTACTOS' },
    { key: 'estado', label: 'ESTADO' },
    { key: 'actions', label: 'ACCIONES' },
  ];

  const renderCell = (sucursal: Sucursal, columnKey: string) => {
    switch (columnKey) {
      case 'direccion':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{sucursal.direccion}</p>
            <p className="text-xs text-default-500">ID: {sucursal.id}</p>
          </div>
        );

      case 'telefono':
        return (
          <div className="flex flex-col gap-1">
            <p className="text-sm">{sucursal.telefono}</p>
          </div>
        );

      case 'ubicacion':
        return (
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-default-400" />
            <div className="flex flex-col text-xs">
              <span>Lat: {sucursal.latitud.toFixed(4)}</span>
              <span>Lng: {sucursal.longitud.toFixed(4)}</span>
            </div>
          </div>
        );

      case 'contactos':
        return (
          <div className="flex flex-col gap-1">
            {sucursal.numerosContacto.length > 0 ? (
              <Chip size="sm" variant="flat" color="primary">
                {sucursal.numerosContacto.length} contactos
              </Chip>
            ) : (
              <span className="text-xs text-default-400">Sin contactos</span>
            )}
          </div>
        );

      case 'estado':
        return (
          <Button
            size="sm"
            color={sucursal.activa ? 'success' : 'default'}
            variant="flat"
            onPress={() => handleToggleActive(sucursal)}
            isLoading={isToggling}
            className="min-w-[90px]"
          >
            {sucursal.activa ? 'Activa' : 'Inactiva'}
          </Button>
        );

      case 'actions':
        return (
          <div className="flex items-center gap-2">
            {onView && (
              <Tooltip content="Ver detalles">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onView(sucursal)}
                >
                  <EyeIcon className="w-5 h-5" />
                </Button>
              </Tooltip>
            )}

            {/* ✅ Botón editar ahora navega en lugar de abrir modal */}
            <Tooltip content="Editar">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="primary"
                onPress={() => handleEdit(sucursal.id)}
              >
                <PencilIcon className="w-5 h-5" />
              </Button>
            </Tooltip>

            <Tooltip content="Eliminar" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => handleDelete(sucursal.id)}
                isLoading={isDeleting}
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Cargando sucursales..." />
      </div>
    );
  }

  if (sucursales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <MapPinIcon className="w-12 h-12 text-default-300" />
        <p className="text-default-500">No hay sucursales registradas</p>
        <p className="text-sm text-default-400">
          Crea tu primera sucursal para comenzar
        </p>
      </div>
    );
  }

  return (
    <Table
      aria-label="Tabla de sucursales"
      classNames={{
        wrapper: 'shadow-md',
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} align={column.key === 'actions' ? 'center' : 'start'}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sucursales}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}