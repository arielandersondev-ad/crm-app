import { cn } from '@/shared/utils/utils'

const styles: Record<string, string> = {
  // positive / active
  Activo: 'bg-success/15 text-success',
  Sano: 'bg-success/15 text-success',
  Pagada: 'bg-success/15 text-success',
  Confirmada: 'bg-success/15 text-success',
  Completada: 'bg-success/15 text-success',
  // neutral
  Inactivo: 'bg-muted text-muted-foreground',
  Observación: 'bg-chart-2/15 text-chart-2',
  'En curso': 'bg-primary/15 text-primary',
  // warning
  Pendiente: 'bg-warning/15 text-warning',
  'En tratamiento': 'bg-warning/15 text-warning',
  // danger
  Moroso: 'bg-destructive/15 text-destructive',
  Reembolsada: 'bg-destructive/15 text-destructive',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[status] ?? 'bg-muted text-muted-foreground',
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
