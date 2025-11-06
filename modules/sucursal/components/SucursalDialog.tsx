'use client';

import {  Modal,  ModalContent,  ModalHeader,  ModalBody,  useDisclosure,} from '@heroui/react';
import  { Sucursal, SucursalForm } from '@/modules/sucursal';

interface SucursalDialogProps {
  sucursal?: Sucursal;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function SucursalDialog({
  sucursal,
  children,
  onSuccess,
}: SucursalDialogProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const isEditing = !!sucursal?.id;

  const handleSuccess = () => {
    onClose();
    onSuccess?.();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <div onClick={onOpen}>{children}</div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: 'max-h-[90vh]',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">
                  {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
                </h2>
                <p className="text-sm text-default-500 font-normal">
                  {isEditing
                    ? `Modifica los datos de la sucursal: ${sucursal.direccion}`
                    : 'Completa la información para crear una nueva sucursal'}
                </p>
              </ModalHeader>

              <ModalBody className="py-6">
                <SucursalForm
                  sucursal={sucursal}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}