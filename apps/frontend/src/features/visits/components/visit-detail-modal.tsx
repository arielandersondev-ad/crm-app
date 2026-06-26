// apps/frontend/src/features/visits/components/visit-detail-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/shared/components/ui/button';
import { UpdateVisitDetailDto, Visit, VisitDetail, Payment, CreatePaymentDto, UpdatePaymentDto } from '../types/visit';
import { SearchModal } from '@/shared/components/search-modal/search-modal';
import {
  useDetailsVisit,
  useUpdateVisitDetail,
  useCreateVisitDetail,
  useCreateManyVisitDetails,
  useDeleteVisitDetail,
  usePaymentVisit,
  useCreatePayment,
  useUpdatePayment,
  useActivarPayment,
  useDesactivarPayment,
  useSumary,
} from '../hooks/use-visits';
import { toast } from 'sonner';
import { VisitInfoSection } from '../sections/visit-info-section';
import { VisitServicesSection } from '../sections/visit-services-section';
import { VisitNotesSection } from '../sections/visit-notes-section';
import { Modal } from '@/shared/components/modal';
import { useServices } from '@/features/services/hooks/use-services';
import { PaymentList } from './payment-list';
import { PaymentSummaryCard } from './payment-sumary-card';
import { PaymentModal } from './payment-modal';
import { EditDetailSchema, EditDetailValues, VisitMainFormSchema, VisitMainFormValues } from '../schemas/visit.schema';

// Tipo auxiliar para detalles locales (coincide con VisitDetail)
type LocalVisitDetail = Omit<VisitDetail, 'updatedAt'> & { updatedAt?: Date };



interface VisitDetailModalProps {
  open: boolean;
  onClose: () => void;
  visit: Visit;
  onSubmit?: (data: VisitMainFormValues) => Promise<void>;
  loading?: boolean;
}

export function VisitDetailModal({ open, onClose, visit, onSubmit, loading }: VisitDetailModalProps) {
  const [localDetails, setLocalDetails] = useState<LocalVisitDetail[]>([]);
  const [editDetailVisitService, setEditDetailVisitService] = useState<UpdateVisitDetailDto | null>(null);
  const { data: detailsVisit, isLoading: detailsLoading } = useDetailsVisit(visit.id);
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: payments = [] } = usePaymentVisit(visit.id);
  const updateDetailMutation = useUpdateVisitDetail(visit.id);
  const createDetailMutation = useCreateVisitDetail(visit.id);
  const createManyDetailsMutation = useCreateManyVisitDetails(visit.id);
  const deleteDetailMutation = useDeleteVisitDetail(visit.id);
  const createPaymentMutation = useCreatePayment(visit.id)
  const updatePaymentMutation = useUpdatePayment(visit.id)
  const activarPaymentMutation = useActivarPayment(visit.id)
  const desactivarPaymentMutation = useDesactivarPayment(visit.id)
 // const {data: sumary} = useSumary(visit.id)

  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const hasPersistedDetails = !!detailsVisit && detailsVisit.length > 0;
  
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  // --- Manejador para pagos (crear y editar) ---
  const handlePaymentSubmit = async (data: CreatePaymentDto | UpdatePaymentDto) => {
    if ('id' in data) {
      updatePaymentMutation.mutate(data as UpdatePaymentDto);
    } else {
      createPaymentMutation.mutate(data as CreatePaymentDto);
    }
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
  };

  const handleActivarPayment = (paymentId: string) => {
    activarPaymentMutation.mutate(paymentId);
  };

  const handleDesactivarPayment = (paymentId: string) => {
    desactivarPaymentMutation.mutate(paymentId);
  };

  // Formulario para la visita principal
  const { register, handleSubmit, formState: { errors } } = useForm<VisitMainFormValues>({
    resolver: zodResolver(VisitMainFormSchema),
    defaultValues: {
      clientId: visit.clientId,
      status: visit.status,
      notes: visit.notes,
      userId: visit.userId,
      startedAt: visit.startedAt ? new Date(visit.startedAt).toISOString().slice(0, 16) : '',
      completedAt: visit.completedAt ? new Date(visit.completedAt).toISOString().slice(0, 16) : '',
    },
  });

  // Form para editar detalle
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm<EditDetailValues>({
    resolver: zodResolver(EditDetailSchema),
  });

  // Resetear formulario cuando se selecciona un detalle para editar
  useEffect(() => {
    if (editDetailVisitService) {
      resetEdit({
        quantity: editDetailVisitService.quantity || 1,
        notes: editDetailVisitService.notes || '',
      });
    }
  }, [editDetailVisitService, resetEdit]);

  // Sincronizar estado local con datos de la API cuando lleguen
  useEffect(() => {
    if (detailsVisit && detailsVisit.length === 0) {
      setLocalDetails([]);
    }
  }, [detailsVisit]);

  const serviceOptions = services?.map(service => ({
    id: service.id,
    label: service.name,
    description: `Bs. ${service.basePrice.toFixed(2)}`,
    service,
  })) ?? [];

  // Manejadores para escenario 1 (no hay detalles persistidos)
  const handleLocalUpdateQuantity = (detailId: string, newQuantity: number) => {
    setLocalDetails(prev => prev.map(detail => {
      if (detail.id === detailId) {
        const newTotal = detail.unitPrice * newQuantity;
        return {
          ...detail, // Mantenemos todas las propiedades existentes
          quantity: newQuantity,
          totalPrice: newTotal
        };
      }
      return detail;
    }));
  };

  const handleLocalDeleteService = (id: string) => {
    setLocalDetails(prev => prev.filter(d => d.id !== id));
  };

  const handleLocalAddService = (item: any) => {
    const service = item.service;
    const newDetail: LocalVisitDetail = {
      id: crypto.randomUUID(),
      visitId: visit.id,
      serviceId: service.id,
      serviceName: service.name,
      quantity: 1,
      unitPrice: service.basePrice,
      totalPrice: service.basePrice,
      notes: '',
      createdAt: new Date(),
    };
    setLocalDetails(prev => [...prev, newDetail]);
    setShowServiceSelector(false);
  };

  const handleSaveLocalDetails = async () => {
    if (localDetails.length === 0) {
      toast.info('No hay servicios para guardar');
      return;
    }
    const dataForApi = {
      visitId: visit.id,
      details: localDetails.map(detail => ({
        serviceId: detail.serviceId,
        quantity: detail.quantity,
        notes: detail.notes,
      })),
    };
    await createManyDetailsMutation.mutateAsync(dataForApi);
    toast.success('Servicios guardados correctamente');
  };

  // Manejadores para escenario 2 (hay detalles persistidos)
  const handlePersistedUpdateQuantity = async (detailId: string, newQuantity: number) => {
    const detail = currentDetails.find(d => d.id === detailId);
    if (!detail) return;
    await updateDetailMutation.mutateAsync({
      id: detailId,
      visitId: visit.id,
      quantity: newQuantity,
    });
  };

  const handlePersistedDeleteService = async (id: string) => {
    await deleteDetailMutation.mutateAsync(id);
    toast.success('Servicio eliminado');
  };

  const handlePersistedAddService = async (item: any) => {
    const service = item.service;
    const data = {
      visitId: visit.id,
      serviceId: service.id,
      quantity: 1,
      notes: '',
    };
    await createDetailMutation.mutateAsync(data);
    setShowServiceSelector(false);
    toast.success('Servicio agregado');
  };

  const handleSaveEditDetail = async (data: EditDetailValues) => {
    if (!editDetailVisitService) return;
    await updateDetailMutation.mutateAsync({
      ...editDetailVisitService,
      quantity: data.quantity,
      notes: data.notes,
    });
    setEditDetailVisitService(null);
    toast.success('Servicio actualizado');
  };

  const currentDetails = hasPersistedDetails ? detailsVisit || [] : localDetails;
  // --- Calculos para el resumen financiero ---
  const totalAmount = currentDetails.reduce((sum, detail) => sum + Number(detail.totalPrice), 0);
  const paidAmount = payments.filter(p => p.status === 'ACTIVE').reduce((sum, p) => sum + Number(p.amount),0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <Modal size="xl" open={open} onClose={onClose} title="" description="">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Header del Modal */}
        <div className="flex justify-between items-start border-b pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Editar Consulta</h2>
          </div>
          <p className="text-sm text-muted-foreground">ID: {visit.id.slice(0, 8)}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit || (() => {}))} className="space-y-6">
          {/* Campo oculto para clientId */}
          <input type="hidden" {...register('clientId')} />

          {/* Secciones */}
          <VisitInfoSection visit={visit} />
          <VisitServicesSection
            details={currentDetails}
            onEdit={(detail) => setEditDetailVisitService({
              id: detail.id,
              visitId: visit.id,
              serviceId: detail.serviceId,
              quantity: detail.quantity,
              notes: detail.notes,
            })}
            onDelete={hasPersistedDetails ? handlePersistedDeleteService : handleLocalDeleteService}
            onUpdateQuantity={hasPersistedDetails ? handlePersistedUpdateQuantity : handleLocalUpdateQuantity}
            onAddService={() => setShowServiceSelector(true)}
          />
          
          {/* Botón Guardar Servicios (solo para escenario 1) */}
          {!hasPersistedDetails && (
            <div className="flex justify-end">
              <Button type="button" onClick={handleSaveLocalDetails} disabled={createManyDetailsMutation.isPending}>
                {createManyDetailsMutation.isPending ? 'Guardando...' : 'Guardar Servicios'}
              </Button>
            </div>
          )}

          {/* --- Secciones de Pagos --- */}
          <PaymentSummaryCard
            total={totalAmount}
            paid={paidAmount}
            pending={pendingAmount}
          />
          
          <PaymentList
            payments={payments}
            onAddPayment={() => setShowAddPayment(true)}
            onEditPayment={handleEditPayment}
            onActivarPayment={handleActivarPayment}
            onDesactivarPayment={handleDesactivarPayment}
          />

          <VisitNotesSection register={register} error={errors.notes?.message} />

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>

      {/* Selector de Servicios */}
      <SearchModal
        title="Seleccionar Servicio"
        open={showServiceSelector}
        items={serviceOptions}
        onClose={() => setShowServiceSelector(false)}
        onSelect={(item) => {
          if (hasPersistedDetails) {
            handlePersistedAddService(item);
          } else {
            handleLocalAddService(item);
          }
        }}
      />

      {/* Modal para editar detalle (podemos moverlo a su propio componente después) */}
      {editDetailVisitService && (
        <Modal
          open={!!editDetailVisitService}
          onClose={() => setEditDetailVisitService(null)}
          title="Editar Servicio"
          description="Modifica la cantidad o las notas del servicio"
        >
          <form onSubmit={handleSubmitEdit(handleSaveEditDetail)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad</label>
              <input
                type="number"
                min="1"
                {...registerEdit('quantity', { valueAsNumber: true })}
                className="w-full border rounded-md p-2"
              />
              {errorsEdit.quantity && (
                <p className="text-destructive text-sm">{errorsEdit.quantity.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
              <textarea
                {...registerEdit('notes')}
                className="w-full border rounded-md p-2 min-h-[80px]"
                placeholder="Agregar notas..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDetailVisitService(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateDetailMutation.isPending}>
                {updateDetailMutation.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      
      {/* Modal para agregar/editar pagos */}
      <PaymentModal
        open={showAddPayment || !!editingPayment}
        visitId={visit.id}
        payment={editingPayment}
        onClose={() => {
          setShowAddPayment(false);
          setEditingPayment(null);
        }}
        onSubmit={handlePaymentSubmit}
        loading={createPaymentMutation.isPending || updatePaymentMutation.isPending}
      />
    </Modal>
  );
}