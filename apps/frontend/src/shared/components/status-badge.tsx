import { cn } from '@/shared/utils/utils'

const statusLabel: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Atendida",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistió",
}

const styles: Record<string, string> = {
  // positive / active
  Activo: 'bg-success/15 text-success',
  Sano: 'bg-success/15 text-success',
  Pagada: 'bg-success/15 text-success',
  Confirmada: 'bg-success/15 text-success',
  COMPLETED: 'bg-success/15 text-success',
  Atendida: 'bg-success/15 text-success',
  // neutral
  Inactivo: 'bg-muted text-muted-foreground',
  Observación: 'bg-chart-2/15 text-chart-2',
  'En curso': 'bg-primary/15 text-primary',
  CONFIRMED: 'bg-primary/15 text-primary',
  // warning
  Pendiente: 'bg-warning/15 text-warning',
  PENDING: 'bg-warning/15 text-warning',
  'En tratamiento': 'bg-warning/15 text-warning',
  // danger
  Moroso: 'bg-destructive/15 text-destructive',
  Reembolsada: 'bg-destructive/15 text-destructive',
  CANCELLED: 'bg-destructive/15 text-destructive',
  Cancelada: 'bg-destructive/15 text-destructive',
  NO_SHOW: 'bg-destructive/15 text-destructive',
}

export function StatusBadge({ status }: { status: string }) {
  const display = statusLabel[status] ?? status
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[display] ?? styles[status] ?? 'bg-muted text-muted-foreground',
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {display}
    </span>
  )
}
