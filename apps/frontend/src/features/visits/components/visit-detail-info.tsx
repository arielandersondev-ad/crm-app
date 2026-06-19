'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Visit } from '../types/visit';

interface VisitDetailInfoProps {
  visit: Visit;
}

export function VisitDetailInfo({ visit }: VisitDetailInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Información del Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="text-lg">👤</span> Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium text-lg">{visit.client?.fullName || 'No asignado'}</p>
          {visit.client?.email && <p className="text-sm text-muted-foreground">{visit.client.email}</p>}
          {visit.client?.phone && <p className="text-sm text-muted-foreground">{visit.client.phone}</p>}
        </CardContent>
      </Card>

      {/* Información del Horario */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="text-lg">📅</span> Horario
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visit.startedAt && (
            <p className="font-medium">
              {new Date(visit.startedAt).toLocaleDateString()}
            </p>
          )}
          {visit.startedAt && (
            <p className="text-sm text-muted-foreground">
              Inicio: {new Date(visit.startedAt).toLocaleTimeString()}
            </p>
          )}
          {visit.completedAt && (
            <p className="text-sm text-muted-foreground">
              Fin: {new Date(visit.completedAt).toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Información del Profesional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="text-lg">🧑‍⚕️</span> Profesional
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visit.user ? (
            <p className="font-medium text-lg">{visit.user.firstName} {visit.user.lastName}</p>
          ) : (
            <p className="text-muted-foreground">No asignado</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}