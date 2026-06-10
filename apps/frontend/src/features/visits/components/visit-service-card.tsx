'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { VisitServicesTable } from './visit-service-table';
import { VisitDetail } from '../types/visit';
import { Plus } from 'lucide-react';

interface VisitServicesCardProps {
  details: VisitDetail[];
  onAddService?: () => void;
  onDeleteService?: (detailId: string) => void;
}

export function VisitServicesCard({ details, onAddService, onDeleteService }: VisitServicesCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Servicios y Procedimientos</CardTitle>
          {onAddService && (
            <Button size="sm" onClick={onAddService}>
              <Plus className="size-4 mr-2" /> Agregar Servicio
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <VisitServicesTable
          details={details}
          onDelete={onDeleteService}
        />
      </CardContent>
    </Card>
  );
}