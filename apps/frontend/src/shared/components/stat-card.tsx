import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/utils/utils'
import { Card } from './ui/card'

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
}: {
  label: string
  value: string
  icon: LucideIcon
  delta?: number
  hint?: string
}) {
  const positive = (delta ?? 0) >= 0
  return (
    <Card className="gap-0 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {typeof delta === 'number' ? (
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-0.5 text-xs font-medium',
              positive ? 'text-success' : 'text-destructive',
            )}
          >
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(delta)}%
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  )
}
