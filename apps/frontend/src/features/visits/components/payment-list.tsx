'use client';

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Plus, Pencil, Ban, RotateCcw } from "lucide-react";
import { Payment } from "../types/visit";

interface PaymentListProps {
  payments: Payment[];
  onAddPayment?: () => void;
  onEditPayment?: (payment: Payment) => void;
  onActivarPayment?: (paymentId: string) => void;
  onDesactivarPayment?: (paymentId: string) => void;
}

export function PaymentList({ payments, onAddPayment, onEditPayment, onActivarPayment, onDesactivarPayment }: PaymentListProps) {
  const getMethodLabel = (method: Payment['method']) => {
    switch (method) {
      case 'CASH': return 'Efectivo';
      case 'QR': return 'QR';
      case 'TRANSFER': return 'Transferencia';
      case 'CARD': return 'Tarjeta';
      default: return method;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            📄 Historial de Pagos
          </CardTitle>
          {onAddPayment && (
            <Button type="button" size="sm" onClick={onAddPayment}>
              <Plus className="size-4 mr-2" />
              Registrar Pago
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay pagos registrados
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg bg-muted">
                <div>
                  <div className="flex flex-row gap-2 p-2 text-center items-center">
                    <p className="font-medium">Bs. {payment.amount.toFixed(2)}</p>
                    <p className={payment.status === 'VOIDED' ? `text-center p-2 bg-destructive/20 rounded-lg` : 'text-center p-2 rounded-lg' }>{payment.status}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getMethodLabel(payment.method)} • {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {payment.reference && (
                    <p className="text-xs text-muted-foreground">Ref: {payment.reference}</p>
                  )}
                  {onEditPayment && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => onEditPayment(payment)}>
                      <Pencil className="size-4" />
                    </Button>
                  )}
                  {payment.status === 'ACTIVE' && onDesactivarPayment && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => onDesactivarPayment(payment.id)} title="Desactivar pago">
                      <Ban className="size-4 text-destructive" />
                    </Button>
                  )}
                  {payment.status === 'VOIDED' && onActivarPayment && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => onActivarPayment(payment.id)} title="Activar pago">
                      <RotateCcw className="size-4 text-success" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}