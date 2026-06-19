// apps/frontend/src/features/visits/sections/visit-info-section.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Visit } from "../types/visit";

interface VisitInfoSectionProps {
  visit: Visit;
}

export function VisitInfoSection({ visit }: VisitInfoSectionProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cliente y Profesional */}
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
            🧑‍⚕️ Profesional
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visit.user && (
            <p className="font-medium text-lg">{visit.user.firstName} {visit.user.lastName}</p>
          )}
        </CardContent>
      </Card>

      {/* Horario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            📅 Horario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">Inicio</label>
            <p>{visit.startedAt ? new Date(visit.startedAt).toLocaleString() : 'No definido'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">Fin</label>
            <p>{visit.completedAt ? new Date(visit.completedAt).toLocaleString() : 'No definido'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Estado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            📌 Estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant= "default"  className="text-lg py-1 px-3">
            {visit.status}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}