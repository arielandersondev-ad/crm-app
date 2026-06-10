// apps/frontend/src/features/visits/components/visit-detail-modal.tsx
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Visit, VisitDetail } from '../types/visit';
import { Trash2, Plus } from 'lucide-react';
import { Modal } from '@/shared/components/modal';
import { useServices } from '@/features/services/hooks/use-services';
import { SearchModal } from '@/shared/components/search-modal/search-modal';

// Schema para el formulario de detalle de visita
const VisitDetailFormSchema = z.object({
  clientId: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
});

type VisitDetailFormValues = z.infer<typeof VisitDetailFormSchema>;

interface VisitDetailModalProps {
  open: boolean;
  onClose: () => void;
  visit: Visit;
  onSubmit?: (data: VisitDetailFormValues) => Promise<void>;
  loading?: boolean;
}

export function VisitDetailModal({ open, onClose, visit, onSubmit, loading }: VisitDetailModalProps) {
  const [details, setDetails] = useState<VisitDetail[]>(visit.details || []);
  const { data: services, isLoading: servicesLoading } = useServices();
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<VisitDetailFormValues>({
    resolver: zodResolver(VisitDetailFormSchema),
    defaultValues: {
      clientId: visit.clientId,
      status: visit.status,
      notes: visit.notes,
      userId: visit.userId,
      startedAt: visit.startedAt ? new Date(visit.startedAt).toISOString().slice(0, 16) : '',
      completedAt: visit.completedAt ? new Date(visit.completedAt).toISOString().slice(0, 16) : '',
    }
  });
  const serviceOptions = services?.map(service => ({
    id: service.id,
    label: service.name,
    description: `Bs. ${service.basePrice.toFixed(2)}`,
    service,
  })) ?? [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN': return 'secondary';
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };
  const handleUpdateQuantity = (detailId: string, newQuantity: number) => {
    setDetails(prev => prev.map(detail => {
      if (detail.id === detailId) {
        const newTotal = detail.unitPrice * newQuantity;
        return { ...detail, quantity: newQuantity, totalPrice: newTotal };
      }
      return detail;
    }));
  };

  const handleDeleteService = (id: string) => {
    setDetails(details.filter(d => d.id !== id));
  };

  const total = details.reduce((sum, detail) => sum + detail.totalPrice, 0);

  return (
    <Modal
      size="xl"
      open={open}
      onClose={onClose}
      title=""
      description=""
    >
      <form onSubmit={handleSubmit(onSubmit || (() => {}))} className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Header del Modal */}
        <div className="flex justify-between items-start border-b pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Editar Visita</h2>
            <Badge variant="default">{visit.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">ID: {visit.id.slice(0, 8)}</p>
        </div>

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
                  Agregar Servicio
                </Button>
              
            </div>
          </CardHeader>
          <CardContent>
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
                {details.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No hay servicios agregados
                    </TableCell>
                  </TableRow>
                ) : (
                  details.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell className="font-medium">{detail.serviceName}</TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min="1"
                          value={detail.quantity}
                          onChange={(e) => handleUpdateQuantity(detail.id, parseInt(e.target.value) || 1)}
                          className="w-20 border rounded-md p-1 text-center"
                        />
                      </TableCell>
                      <TableCell>Bs. {detail.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>Bs. {detail.totalPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteService(detail.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {details.length > 0 && (
              <div className="flex justify-end border-t pt-4 mt-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">Bs. {total.toFixed(2)}</p>
                </div>
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>

      <SearchModal
        title="Seleccionar Servicio"
        open={showServiceSelector}
        items={serviceOptions}
        onClose={() => setShowServiceSelector(false)}
        onSelect={(item) => {
          const service = item.service;
          setDetails(prev => [
            ...prev,
            {
              id: crypto.randomUUID(),
              visitId: visit.id,
              serviceId: service.id,
              serviceName: service.name,
              quantity: 1,
              unitPrice: service.basePrice,
              totalPrice: service.basePrice,
              notes: '',
              createdAt: new Date(),
            } as VisitDetail
          ]);
          setShowServiceSelector(false);
        }}
      />
    </Modal>
  );
}