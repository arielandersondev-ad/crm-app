'use client';

import { Button } from '@/shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { VisitDetail } from '../types/visit';
import { Trash2 } from 'lucide-react';

interface VisitServicesTableProps {
  details: VisitDetail[];
  onDelete?: (detailId: string) => void;
}

export function VisitServicesTable({ details, onDelete }: VisitServicesTableProps) {
  const total = details.reduce((sum, detail) => sum + detail.totalPrice, 0);

  return (
    <div className="space-y-4">
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
                No hay servicios agregados a esta visita
              </TableCell>
            </TableRow>
          ) : (
            details.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell className="font-medium">{detail.serviceName}</TableCell>
                <TableCell>{detail.quantity}</TableCell>
                <TableCell>Bs. {detail.unitPrice.toFixed(2)}</TableCell>
                <TableCell>Bs. {detail.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(detail.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {details.length > 0 && (
        <div className="flex justify-end border-t pt-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold">Bs. {total.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}