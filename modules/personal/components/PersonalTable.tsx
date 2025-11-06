"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {  Table,  TableHeader,  TableColumn,  TableBody,  TableRow,  TableCell,  Chip,  Tooltip,  Button,
  Spinner,  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter,  useDisclosure,} from '@heroui/react';
import {  PencilIcon,  TrashIcon,  PhoneIcon,  EnvelopeIcon,  BuildingOfficeIcon,} from '@heroicons/react/24/outline';
import { usePersonal, usePersonalMutations, Personal } from "@/modules/personal";

export function PersonalTable() {
  const router = useRouter();
  const { personal, isLoading } = usePersonal();
  const { remove, isDeleting } = usePersonalMutations();
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [personalToDelete, setPersonalToDelete] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    router.push(`/personal/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setPersonalToDelete(id);
    onOpen();
  };

  const handleConfirmDelete = () => {
    if (personalToDelete) {
      remove(personalToDelete);
      onOpenChange();
      setPersonalToDelete(null);
    }
  };

  const columns = [
    { key: 'nombreCompleto', label: 'NOMBRE COMPLETO' },
    { key: 'correo', label: 'CORREO' },
    { key: 'telefonos', label: 'TELÉFONOS' },
    { key: 'corporativo', label: 'CORPORATIVO' },
    { key: 'sucursal', label: 'SUCURSAL' },
    { key: 'actions', label: 'ACCIONES' },
  ];

  const renderCell = (person: Personal, columnKey: string) => {
    switch (columnKey) {
      case 'nombreCompleto':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{person.nombreCompleto}</p>
            <p className="text-xs text-default-500">ID: {person.id}</p>
          </div>
        );

      case 'correo':
        return (
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4 text-default-400" />
            <p className="text-sm">{person.correoInstitucional}</p>
          </div>
        );

      case 'telefonos':
        return (
          <div className="flex flex-col gap-1">
            {person.numerosTelefono.length > 0 ? (
              person.numerosTelefono.map((tel, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <PhoneIcon className="w-3 h-3 text-default-400" />
                  <span className="text-xs">{tel}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-default-400">Sin teléfonos</span>
            )}
          </div>
        );

      case 'corporativo':
        return person.numeroCorporativo ? (
          <Chip size="sm" variant="flat" color="primary">
            {person.numeroCorporativo}
          </Chip>
        ) : (
          <span className="text-xs text-default-400">No asignado</span>
        );

      case 'sucursal':
        return person.sucursal ? (
          <div className="flex items-center gap-2">
            <BuildingOfficeIcon className="w-4 h-4 text-default-400" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{person.sucursal.direccion}</span>
              <span className="text-xs text-default-400">ID: {person.sucursal.id}</span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-default-400">Sin sucursal</span>
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
                onPress={() => handleEdit(person.id)}
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
                onPress={() => handleDeleteClick(person.id)}
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
        <Spinner size="lg" label="Cargando personal..." />
      </div>
    );
  }

  if (personal.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <BuildingOfficeIcon className="w-12 h-12 text-default-300" />
        <p className="text-default-500">No hay personal registrado</p>
        <p className="text-sm text-default-400">
          Agrega el primer miembro del personal para comenzar
        </p>
      </div>
    );
  }

  return (
    <>
      <Table
        aria-label="Tabla de personal"
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
        <TableBody items={personal}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar Eliminación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar este personal?
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
                  onPress={onClose}
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