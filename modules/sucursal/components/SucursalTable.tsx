"use client";

import { useRouter } from 'next/navigation';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip, Tooltip, Button, Spinner
} from '@heroui/react';
import {
  PencilIcon, TrashIcon, EyeIcon, MapPinIcon
} from '@heroicons/react/24/outline';
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
            <p className="font-medium text-gray-900">{sucursal.direccion}</p>
            <p className="text-xs text-gray-400">ID: {sucursal.id}</p>
          </div>
        );

      case 'telefono':
        return <p className="text-gray-700">{sucursal.telefono}</p>;

      case 'ubicacion':
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <div className="flex flex-col">
              <span>Lat: {sucursal.latitud.toFixed(4)}</span>
              <span>Lng: {sucursal.longitud.toFixed(4)}</span>
            </div>
          </div>
        );

      case 'contactos':
        return sucursal.numerosContacto.length > 0 ? (
          <Chip size="sm" variant="flat" color="primary">
            {sucursal.numerosContacto.length} contactos
          </Chip>
        ) : (
          <span className="text-xs text-gray-400 italic">Sin contactos</span>
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
                  <EyeIcon className="w-5 h-5 text-gray-600" />
                </Button>
              </Tooltip>
            )}
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
        <MapPinIcon className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500">No hay sucursales registradas</p>
        <p className="text-sm text-gray-400">
          Crea tu primera sucursal para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sucursales</h2>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <Table
          aria-label="Tabla de sucursales"
          classNames={{
            base: "min-w-full divide-y divide-gray-100",
            wrapper: "overflow-hidden",
            th: "bg-gray-50 text-gray-600 font-semibold text-sm uppercase tracking-wide",
            td: "text-sm text-gray-700",
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
              <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey as string)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
