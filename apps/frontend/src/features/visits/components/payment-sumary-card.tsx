'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DollarSign, Wallet } from "lucide-react";

interface PaymentSummaryCardProps {
  total: number;
  paid: number;
  pending: number;
}

export function PaymentSummaryCard({ total, paid, pending }: PaymentSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          💸 Resumen Financiero
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Total</p>
          <p className="text-xl font-bold text-foreground">Bs. {total.toFixed(2)}</p>
        </div>
        
        <div className="text-center p-3 bg-success/10 rounded-lg">
          <p className="text-xs text-success mb-1">Pagado</p>
          <p className="text-xl font-bold text-success">Bs. {paid.toFixed(2)}</p>
        </div>
        
        <div className="text-center p-3 bg-warning/10 rounded-lg">
          <p className="text-xs text-warning mb-1">Pendiente</p>
          <p className="text-xl font-bold text-warning">Bs. {pending.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}