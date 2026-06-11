'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { UpdateVisitDetailDto, Visit, VisitDetail, CreateVisitDetailDto } from '../types/visit';
import { Trash2, Plus, RefreshCcw } from 'lucide-react';
import { Modal } from '@/shared/components/modal';
import { useServices } from '@/features/services/hooks/use-services';
import { SearchModal } from '@/shared/components/search-modal/search-modal';
import { 
  useDetailsVisit, 
  useUpdateVisitDetail, 
  useCreateVisitDetail, 
  useCreateManyVisitDetails, 
  useDeleteVisitDetail 
} from '../hooks/use-visits';
import { toast } from 'sonner';

// Tipo auxiliar para detalles locales (solo lo que necesitamos sin fechas)
type LocalVisitDetail = {
  id: string;
  visitId: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
};

// Schema para el formulario de la visita principal
const VisitMainFormSchema = z.object({
  clientId: z.string(), // Hacemos clientId requerido (la visita siempre tiene uno)
  status: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
});

type VisitMainFormValues = z.infer<typeof VisitMainFormSchema>;

// Schema para editar detalle
const EditDetailSchema = z.object({
  quantity: z.number().min(1),
  notes: z.string().optional(),
});

type EditDetailValues = z.infer<typeof EditDetailSchema>;

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
  
  // Hooks para las mutaciones
  const updateDetailMutation = useUpdateVisitDetail(visit.id);
  const createDetailMutation = useCreateVisitDetail(visit.id);
  const createManyDetailsMutation = useCreateManyVisitDetails(visit.id);
  const deleteDetailMutation = useDeleteVisitDetail(visit.id);

  // Estados auxiliares
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const hasPersistedDetails = !!detailsVisit && detailsVisit.length > 0;

  // Formulario para la visita principal
  const { register, handleSubmit, formState: { errors } } = useForm<VisitMainFormValues>({
    resolver: zodResolver(VisitMainFormSchema),
    defaultValues: {
      clientId: visit.clientId, // Agregamos clientId a los valores por defecto
      status: visit.status,
      notes: visit.notes,
      userId: visit.userId,
      startedAt: visit.startedAt ? new Date(visit.startedAt).toISOString().slice(0, 16) : '',
      completedAt: visit.completedAt ? new Date(visit.completedAt).toISOString().slice(0, 16) : '',
    }
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

  // Opciones de servicios para el selector
  const serviceOptions = services?.map(service => ({
    id: service.id,
    label: service.name,
    description: `Bs. ${service.basePrice.toFixed(2)}`,
    service,
  })) ?? [];

  // Funciones de ayuda
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN': return 'secondary';
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };

  // Calcular total
  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, detail) => sum + Number(detail.totalPrice), 0);
  };

  const total = hasPersistedDetails ? calculateTotal(detailsVisit || []) : calculateTotal(localDetails);
  const currentDetails = hasPersistedDetails ? detailsVisit || [] : localDetails;

  // Manejadores de eventos para el escenario 1 (no hay detalles persistidos)
  const handleLocalUpdateQuantity = (detailId: string, newQuantity: number) => {
    setLocalDetails(prev => prev.map(detail => {
      if (detail.id === detailId) {
        const newTotal = detail.unitPrice * newQuantity;
        return { ...detail, quantity: newQuantity, totalPrice: newTotal };
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

  // Manejadores de eventos para el escenario 2 (hay detalles persistidos)
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
    const data: CreateVisitDetailDto = {
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

  return (
    <Modal
      size="xl"
      open={open}
      onClose={onClose}
      title=""
      description=""
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Header del Modal */}
        <div className="flex justify-between items-start border-b pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Editar Visita</h2>
            <Badge variant="default">{visit.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">ID: {visit.id.slice(0, 8)}</p>
        </div>

        {/* Campo oculto para clientId (requerido por el backend) */}
        <input type="hidden" {...register('clientId')} />

        {/* Sección 1: Información General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                👤 Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-lg">{visit.client?.fullName || 'No asignado'}</p>
              {visit.client?.email && <p className="text-sm text-muted-foreground">{visit.client.email}</p>}
              {visit.client?.phone && <p className="text-sm text-muted-foreground">{visit.client.phone}</p>}
            </CardContent>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                🧑‍⚕️ Atendido por
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-lg">{visit.user?.firstName} {visit.user?.lastName || 'No asignado'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                📅 Horario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Inicio</label>
                <input
                  type="datetime-local"
                  {...register('startedAt')}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fin</label>
                <input
                  type="datetime-local"
                  {...register('completedAt')}
                  className="w-full border rounded-md p-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                🧑‍⚕️ Profesional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  {...register('status')}
                  className="w-full border rounded-md p-2 mb-4"
                >
                  <option value="OPEN">Abierta</option>
                  <option value="IN_PROGRESS">En Progreso</option>
                  <option value="COMPLETED">Completada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>
              {visit.user && (
                <p className="font-medium">{visit.user.firstName} {visit.user.lastName}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sección 2: Servicios */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                💉 Servicios y Procedimientos
              </CardTitle>
                <Button type="button" onClick={() => setShowServiceSelector(true)}>
                  <Plus className="size-4 mr-2" />
                  Buscar Servicio
                </Button>
              
            </div>
          </CardHeader>
          <CardContent>
            {detailsLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-muted-foreground">Cargando detalles...</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio Unitario</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No hay servicios agregados
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentDetails.map((detail) => (
                        <TableRow key={detail.id}>
                          <TableCell className="font-medium">{detail.serviceName}</TableCell>
                          <TableCell>
                            <input
                              type="number"
                              min="1"
                              value={detail.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 1;
                                if (hasPersistedDetails) {
                                  handlePersistedUpdateQuantity(detail.id, newQty);
                                } else {
                                  handleLocalUpdateQuantity(detail.id, newQty);
                                }
                              }}
                              className="w-20 border rounded-md p-1 text-center"
                            />
                          </TableCell>
                          <TableCell>Bs. {detail.unitPrice}</TableCell>
                          <TableCell>Bs. {detail.totalPrice}</TableCell>
                          <TableCell className="text-right">
                            <Button type="button" variant="ghost" size="sm" onClick={
                              () => setEditDetailVisitService({
                                id: detail.id,
                                visitId: visit.id,
                                serviceId: detail.serviceId,
                                quantity: detail.quantity,
                                notes: detail.notes,
                              })
                            }>
                              <RefreshCcw className="size-4 text-blue-500" />
                            </Button>
                            <Button type="button" variant="ghost" size="sm" onClick={() => {
                              if (hasPersistedDetails) {
                                handlePersistedDeleteService(detail.id);
                              } else {
                                handleLocalDeleteService(detail.id);
                              }
                            }}>
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {currentDetails.length > 0 && (
                  <div className="flex justify-end border-t pt-4 mt-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold">Bs. {total}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Botón Guardar Servicios (solo para escenario 1) */}
            {!hasPersistedDetails && (
              <div className="flex justify-end mt-4 pt-4 border-t">
                <Button 
                  type="button" 
                  onClick={handleSaveLocalDetails}
                  disabled={createManyDetailsMutation.isPending}
                >
                  {createManyDetailsMutation.isPending ? 'Guardando...' : 'Guardar Servicios'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sección 3: Notas */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Notas Administrativas</label>
          <textarea
            {...register('notes')}
            className="w-full min-h-[100px] border rounded-md p-3"
            placeholder="Agregar notas..."
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            disabled={loading}
            onClick={handleSubmit(onSubmit || (() => {}))}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

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

      {/* Modal para editar detalle */}
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
              <p className="text-red-500 text-sm">{errorsEdit.quantity.message}</p>
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
            <Button
              type="submit"
              disabled={updateDetailMutation.isPending}
            >
              {updateDetailMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>
    </Modal>
  );
}