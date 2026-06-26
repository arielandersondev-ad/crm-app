'use client';

import { Button } from '@/shared/components/ui/button';
import { Visit } from '../types/visit';
import { Badge } from '@/shared/components/ui/badge';

interface VisitDetailHeaderProps {
  visit: Visit;
  onEditClick?: () => void;
}

export function VisitDetailHeader({ visit, onEditClick }: VisitDetailHeaderProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN': return 'secondary';
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">Detalles de la Consulta</h1>
          <Badge variant={'secondary'}>
            {visit.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          ID: {visit.id} · Creada el {new Date(visit.createdAt).toLocaleDateString()}
        </p>
      </div>

      {onEditClick && (
        <Button onClick={onEditClick}>
          Editar Consulta
        </Button>
      )}
    </div>
  );
}