'use client';

import { useParams } from 'next/navigation';
import { PageContainer } from '@/shared/components/page-container';
import { PageHeader } from '@/shared/components/page-header';
import { VisitDetailHeader } from '../components/visit-detail-header';
import { VisitDetailInfo } from '../components/visit-detail-info';
import { VisitServicesCard } from '../components/visit-service-card';
import { useState } from 'react';

// Datos de ejemplo
const MOCK_VISIT = {
  id: 'vst-92841',
  tenantId: 'tnt-1',
  sucursalId: 'suc-1',
  clientId: 'cli-1',
  userId: 'usr-1',
  appointmentId: null,
  status: 'IN_PROGRESS',
  notes: 'Paciente viene por control de rutina',
  startedAt: new Date().toISOString(),
  completedAt: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  client: {
    id: 'cli-1',
    fullName: 'Mario Castañeda',
    email: 'mario@mail.com',
    phone: '12345678'
  },
  user: {
    id: 'usr-1',
    firstName: 'Juan',
    lastName: 'Pérez'
  },
  details: [
    {
      id: 'det-1',
      visitId: 'vst-92841',
      serviceId: 'svc-1',
      quantity: 1,
      serviceName: 'Consulta General',
      unitPrice: 150,
      totalPrice: 150,
      notes: '',
      createdAt: new Date()
    },
    {
      id: 'det-2',
      visitId: 'vst-92841',
      serviceId: 'svc-2',
      quantity: 1,
      serviceName: 'Limpieza Dental',
      unitPrice: 300,
      totalPrice: 300,
      notes: 'Con fluoruro',
      createdAt: new Date()
    }
  ]
};

export function VisitDetailPage() {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <PageContainer>
      <PageHeader title="Detalles de Visita" backButton />
      
      <div className="space-y-6 mt-6">
        <VisitDetailHeader
          visit={MOCK_VISIT}
          onEditClick={() => setIsEditing(!isEditing)}
        />

        <VisitDetailInfo visit={MOCK_VISIT} />

        <VisitServicesCard
          details={MOCK_VISIT.details}
          onAddService={() => console.log('Agregar servicio')}
          onDeleteService={(id) => console.log('Eliminar servicio', id)}
        />

        {/* Notas administrativas */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase">Notas Administrativas</h3>
          <textarea
            className="w-full min-h-[100px] rounded-md border p-2"
            defaultValue={MOCK_VISIT.notes}
            placeholder="Agregar notas..."
          />
        </div>
      </div>
    </PageContainer>
  );
}