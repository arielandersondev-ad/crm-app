'use client'

import { Clock, User } from 'lucide-react'
import Link from 'next/link'

import { StatusBadge } from '@/shared/components/status-badge'
import { cn } from '@/shared/utils/utils'

import { Details } from '../types/interfaces'

const horas = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
]

const statusColor: Record<string, string> = {
  PENDING: 'border-l-warning',
  CONFIRMED: 'border-l-primary',
  COMPLETED: 'border-l-success',
  CANCELLED: 'border-l-destructive',
  NO_SHOW: 'border-l-destructive',
}

interface Props {
  appointments: Details[]
  onSelected: (c:any)=>void
}

export function AgendaDiaView({ appointments,onSelected }: Props) {
  return (
    <div className="divide-y divide-border">
      {horas.map((hora) => {
        const enHora = appointments.filter((c) =>
          c.hora.startsWith(hora.slice(0, 2))
        )

        return (
          <div key={hora} className="flex gap-4 px-4 py-3">
            <span className="w-12 shrink-0 pt-1 font-mono text-xs text-muted-foreground">
              {hora}
            </span>

            <div className="flex-1 space-y-2">
              {enHora.length === 0 ? (
                <div className="h-8 rounded-md border border-dashed border-border/60" />
              ) : (
                enHora.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onSelected(c)}
                    className={cn(
                      'rounded-md border border-l-4 border-border bg-secondary/40 p-3 cursor-pointer hover:bg-secondary/60 transition-colors',
                      statusColor[c.status] ?? 'border-l-primary',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                          <Link
                            href={`/dashboard/clientes/${c.clientId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <User className="size-3" />
                            {c.clientFullName}
                          </Link>

                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {c.hora} hr
                          </span>
                        </p>
                      </div>

                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}