"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { PencilIcon, TrashIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useHorario, useHorarioMutations, Horario, DayOfWeek } from "@/modules/horarios";

// Mapeo de días en español
const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

// Colores para los días
const DAY_COLORS: Record<DayOfWeek, "primary" | "secondary" | "success" | "warning" | "danger"> = {
  MONDAY: 'primary',
  TUESDAY: 'secondary',
  WEDNESDAY: 'success',
  THURSDAY: 'warning',
  FRIDAY: 'danger',
  SATURDAY: 'primary',
  SUNDAY: 'secondary',
};

export function HorarioTable() {
  const router = useRouter();
  const { horarios, isLoading } = useHorario();
  const { remove, isDeleting } = useHorarioMutations();

  // Usar onClose para cerrar el modal de forma consistente
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [horarioToDelete, setHorarioToDelete] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    router.push(`/horarios/${id}/editar`);
  };

  const handleDeleteClick = (id: number) => {
    setHorarioToDelete(id);
    onOpen();
  };

  const handleConfirmDelete = () => {
    if (horarioToDelete !== null) {
      remove(horarioToDelete);
      onClose(); // cerrar modal
      setHorarioToDelete(null);
    }
  };

  const columns = [
    { key: 'diaSemana', label: 'DÍA' },
    { key: 'horario', label: 'HORARIO' },
    { key: 'duracion', label: 'DURACIÓN' },
    { key: 'actions', label: 'ACCIONES' },
  ];

  // Calcular duración en horas
  const calcularDuracion = (apertura: string, cierre: string): string => {
    const [horaA, minA] = apertura.split(':').map(Number);
    const [horaC, minC] = cierre.split(':').map(Number);

    const minutosApertura = horaA * 60 + minA;
    const minutosCierre = horaC * 60 + minC;
    const duracionMinutos = minutosCierre - minutosApertura;

    const horas = Math.floor(duracionMinutos / 60);
    const minutos = duracionMinutos % 60;

    return minutos > 0 ? `${horas}h ${minutos}m` : `${horas}h`;
  };

  const renderCell = (horario: Horario, columnKey: string) => {
    switch (columnKey) {
      case 'diaSemana':
        return (
          <Chip
            size="lg"
            variant="flat"
            color={DAY_COLORS[horario.diaSemana]}
            startContent={<CalendarIcon className="w-4 h-4" />}
          >
            {DAY_LABELS[horario.diaSemana]}
          </Chip>
        );

      case 'horario':
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold">Apertura: {horario.horaApertura}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-danger" />
              <span className="text-sm font-semibold">Cierre: {horario.horaCierre}</span>
            </div>
          </div>
        );

      case 'duracion':
        return (
          <Chip size="sm" variant="bordered" color="default">
            {calcularDuracion(horario.horaApertura, horario.horaCierre)}
          </Chip>
        );

      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Editar">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="primary"
                onPress={() => handleEdit(horario.id)}
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
                onPress={() => handleDeleteClick(horario.id)}
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
        <Spinner size="lg" label="Cargando horarios..." />
      </div>
    );
  }

  if (horarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <ClockIcon className="w-12 h-12 text-default-300" />
        <p className="text-default-500">No hay horarios registrados</p>
        <p className="text-sm text-default-400">
          Agrega el primer horario para comenzar
        </p>
      </div>
    );
  }

  return (
    <>
      <Table
        aria-label="Tabla de horarios"
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
        <TableBody items={horarios}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          {(onCloseFromModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar Eliminación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar este horario?
                  <br />
                  <span className="font-bold text-danger-500">
                    Esta acción no se puede deshacer.
                  </span>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="flat"
                  onPress={onCloseFromModal}
                  isDisabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}