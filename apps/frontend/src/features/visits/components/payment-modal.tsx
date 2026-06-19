'use client';

import { useEffect } from 'react';
import { Modal } from "@/shared/components/modal";
import { Button } from "@/shared/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePaymentDto, Payment, UpdatePaymentDto } from "../types/visit";

const PaymentSchema = z.object({
  amount: z.number().min(0.01, "El monto debe ser mayor a 0"),
  method: z.enum(['CASH', 'QR', 'TRANSFER', 'CARD']),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof PaymentSchema>;

interface PaymentModalProps {
  open: boolean;
  visitId: string;
  onClose: () => void;
  onSubmit: (data: CreatePaymentDto | UpdatePaymentDto) => void;
  payment?: Payment | null;
  loading?: boolean;
}

export function PaymentModal({ open, visitId, onClose, onSubmit, payment, loading }: PaymentModalProps) {
  const isEditing = !!payment;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PaymentFormValues>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      method: 'CASH',
      amount: 0,
    },
  });

  useEffect(() => {
    if (payment) {
      reset({
        amount: payment.amount,
        method: payment.method,
        reference: payment.reference || '',
        notes: payment.notes || '',
      });
    } else {
      reset({ method: 'CASH', amount: 0 });
    }
  }, [payment, reset]);

  const handleClose = () => {
    reset(isEditing ? { method: 'CASH', amount: 0 } : { method: 'CASH', amount: 0 });
    onClose();
  };

  const handleFormSubmit = async (formData: PaymentFormValues) => {
    if (payment) {
      const dataForApi: UpdatePaymentDto = {
        id: payment.id,
        visitId,
        amount: formData.amount,
        method: formData.method,
        reference: formData.reference,
        notes: formData.notes,
        paidAt: payment.paidAt,
        status: payment.status,
      };
      await onSubmit(dataForApi);
    } else {
      const dataForApi: CreatePaymentDto = {
        ...formData,
        visitId,
      };
      await onSubmit(dataForApi);
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar Pago' : 'Registrar Pago'}
      description={isEditing ? 'Modifica los datos del pago' : 'Agrega un nuevo pago a esta visita'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Monto</label>
          <input
            type="number"
            step="0.10"
            min="0"
            {...register('amount', { valueAsNumber: true })}
            className="w-full border rounded-md p-2"
            placeholder="0.00"
          />
          {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Método de Pago</label>
          <select {...register('method')} className="w-full border rounded-md p-2">
            <option value="CASH">Efectivo</option>
            <option value="QR">QR</option>
            <option value="TRANSFER">Transferencia</option>
            <option value="CARD">Tarjeta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Referencia (opcional)</label>
          <input
            type="text"
            {...register('reference')}
            className="w-full border rounded-md p-2"
            placeholder="Número de referencia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
          <textarea
            {...register('notes')}
            className="w-full border rounded-md p-2 min-h-[80px]"
            placeholder="Agregar notas..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Pago'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
