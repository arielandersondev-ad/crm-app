'use client'

import { useState } from 'react'
import { Card } from '@/shared/components/ui/card'
import { cn } from '@/shared/utils/utils'
import { AgendaHeader } from './agenda-header'
import { AgendaDiaView } from './agenda-dia-view'
import { AgendaMesView } from './agenada-mes-view'
import { AgendaSemanaView } from './agenada-semana-view'
import { AgendaResponse } from '../types/interfaces'

export function AgendaBoard({data,}: {  data?: AgendaResponse}) {
  const agendaData = data?.appointments ?? []
  const [vista, setVista] = useState('Día')
  const [currentDate, setCurrentDate] = useState(new Date())

  // funciones de paginacion
  const prevPeriod = () => {
    const date = new Date(currentDate)
    if (vista === 'Día') {date.setDate(date.getDate() - 1)}
    if (vista === 'Semana') {date.setDate(date.getDate() - 7)}
    if (vista === 'Mes') {date.setMonth(date.getMonth() - 1)}
    setCurrentDate(date)
  }
  const nextPeriod = () => {
    const date = new Date(currentDate)
    if (vista === 'Día') {date.setDate(date.getDate() + 1)}
    if (vista === 'Semana') {date.setDate(date.getDate() + 7)}
    if (vista === 'Mes') {date.setMonth(date.getMonth() + 1)}
    setCurrentDate(date)
  }
  // datos para el dia
  const citasDelDia = agendaData.filter((appointment) => {
    const citaDate = new Date(appointment.scheduledAt)

    return (
      citaDate.getFullYear() === currentDate.getFullYear() &&
      citaDate.getMonth() === currentDate.getMonth() &&
      citaDate.getDate() === currentDate.getDate()
    )
  })
  const inicioSemana = new Date(currentDate)
  inicioSemana.setDate(currentDate.getDate() - currentDate.getDay())
  inicioSemana.setHours(0, 0, 0, 0)

  const finSemana = new Date(inicioSemana)
  finSemana.setDate(finSemana.getDate() + 6)
  finSemana.setHours(23, 59, 59, 999)

  const citasSemana = agendaData.filter((appointment) => {
    const fecha = new Date(appointment.scheduledAt)
    return fecha >= inicioSemana && fecha <= finSemana
  })
  // datos para el mes
  const citasMes = agendaData.filter((appointment) => {
    const fecha = new Date(appointment.scheduledAt)

    return (
      fecha.getFullYear() === currentDate.getFullYear() &&
      fecha.getMonth() === currentDate.getMonth()
    )
  })
  // dias Semana
  const diasSemana = Array.from({ length: 5 }, (_, index) => {
    const fecha = new Date(inicioSemana)
    fecha.setDate(inicioSemana.getDate() + index)
    return fecha
  })
  const semanaAgrupada = diasSemana.map((dia) => {
    const citas = citasSemana.filter((appointment) => {
      const fecha = new Date(appointment.scheduledAt)

      return (
        fecha.getFullYear() === dia.getFullYear() &&
        fecha.getMonth() === dia.getMonth() &&
        fecha.getDate() === dia.getDate()
      )
    })

    return {
      fecha: dia,
      citas,
    }
  })
  //Mes
  const inicioMes = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )

  const finMes = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )
  const semanasDelMes = []
  let inicioSemanaMes = new Date(inicioMes)
  while (inicioSemanaMes <= finMes) {
    const finSemanaMes = new Date(inicioSemanaMes)
    finSemanaMes.setDate(finSemanaMes.getDate() + 6)
    semanasDelMes.push({
      inicio: new Date(inicioSemanaMes),
      fin: new Date(finSemanaMes),
    })
    inicioSemanaMes = new Date(finSemanaMes)
    inicioSemanaMes.setDate(inicioSemanaMes.getDate() + 1)
  }
  const mesAgrupado = semanasDelMes.map((semana, index) => {
    const citas = citasMes.filter((appointment) => {
      const fecha = new Date(appointment.scheduledAt)

      return (
        fecha >= semana.inicio &&
        fecha <= semana.fin
      )
    })

    return {
      numero: index + 1,
      inicio: semana.inicio,
      fin: semana.fin,
      citas,
    }
  })
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      <Card className="gap-0 p-0">
        <AgendaHeader
          vista={vista}
          currentDate={currentDate}
          onPrev={prevPeriod}
          onNext={nextPeriod}
          onChangeView={setVista}
        />

        {vista === 'Día' && (
          <AgendaDiaView appointments={citasDelDia} />
        )}

        {vista === 'Semana' && (
          <AgendaSemanaView week={semanaAgrupada} />
        )}

        {vista === 'Mes' && (
          <AgendaMesView weeks={mesAgrupado} />
        )}
      </Card>

      <div className="space-y-4">
        <Card className="gap-3 p-5">
          <h3 className="font-semibold">Veterinarios hoy</h3>
          <ul className="space-y-3">
            {[
              { nombre: 'Dra. Reyes', citas: 3, color: 'bg-chart-1' },
              { nombre: 'Dr. Vargas', citas: 3, color: 'bg-chart-2' },
            ].map((v) => (
              <li key={v.nombre} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className={cn('size-2.5 rounded-full', v.color)} />
                  {v.nombre}
                </span>
                <span className="text-muted-foreground">{v.citas} citas</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="gap-3 p-5">
          <h3 className="font-semibold">Resumen del día</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Total citas</dt><dd className="font-medium">6</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Completadas</dt><dd className="font-medium text-success">1</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">En curso</dt><dd className="font-medium text-primary">1</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Pendientes</dt><dd className="font-medium text-warning">2</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Confirmadas</dt><dd className="font-medium">2</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
