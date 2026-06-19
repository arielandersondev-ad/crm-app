'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

interface Props {
  vista: string
  currentDate: Date
  onPrev: () => void
  onNext: () => void
  onChangeView: (value: string) => void
}

export function AgendaHeader({ vista, currentDate, onPrev, onNext, onChangeView,}: Props) {
  let title = ''
  if (vista === 'Día') {
    title = currentDate.toLocaleDateString('es-BO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  if (vista === 'Semana') {
  const inicioSemana = new Date(currentDate)
  const day = inicioSemana.getDay()
  const diff = day === 0 ? -6 : 1 - day
  inicioSemana.setDate(inicioSemana.getDate() + diff)
  const finSemana = new Date(inicioSemana)
  finSemana.setDate(finSemana.getDate() + 4)
    title = `${inicioSemana.toLocaleDateString('es-BO', {
      day: 'numeric',
      month: 'short',
    })} - ${finSemana.toLocaleDateString('es-BO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}`
  }
  if (vista === 'Mes') {
    title = currentDate.toLocaleDateString('es-BO', {
      month: 'long',
      year: 'numeric',
    })
  }
  return (
    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onPrev}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <span className="min-w-40 text-center text-sm font-medium">
          {title}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onNext}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <Tabs value={vista} onValueChange={onChangeView}>
        <TabsList>
          <TabsTrigger value="Día">Día</TabsTrigger>
          <TabsTrigger value="Semana">Semana</TabsTrigger>
          <TabsTrigger value="Mes">Mes</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}