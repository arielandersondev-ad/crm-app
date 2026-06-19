// apps/frontend/src/features/visits/sections/visit-services-section.tsx
'use client';

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { VisitDetail } from "../types/visit";
import { Trash2, Plus, RefreshCcw } from "lucide-react";

interface VisitServicesSectionProps {
  details: VisitDetail[];
  onEdit?: (detail: VisitDetail) => void;
  onDelete?: (id: string) => void;
  onUpdateQuantity?: (id: string, qty: number) => void;
  onAddService?: () => void;
}

export function VisitServicesSection({
  details,
  onEdit,
  onDelete,
  onUpdateQuantity,
  onAddService,
}: VisitServicesSectionProps) {
  const total = details.reduce((sum, detail) => sum + Number(detail.totalPrice), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            💉 Servicios y Procedimientos
          </CardTitle>
          {onAddService && (
            <Button type="button" onClick={onAddService}>
              <Plus className="size-4 mr-2" />
              Agregar Servicio
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {details.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay servicios agregados
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
                {details.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell className="font-medium">{detail.serviceName}</TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min="1"
                        value={detail.quantity}
                        onChange={(e) => onUpdateQuantity?.(detail.id, parseInt(e.target.value) || 1)}
                        className="w-20 border rounded-md p-1 text-center"
                      />
                    </TableCell>
                    <TableCell>Bs. {detail.unitPrice}</TableCell>
                    <TableCell>Bs. {detail.totalPrice}</TableCell>
                    <TableCell className="text-right">
                      {onEdit && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(detail)}>
                          <RefreshCcw className="size-4 text-primary" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(detail.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end border-t pt-4 mt-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">Bs. {total}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}