'use client'

import { useState } from 'react'
import { Card } from '@/shared/components/ui/card'
import { dateKey } from '@/shared/utils/date-time'
import { buildAgendaCalendar } from '../utils/agenda-calendar'
import { AgendaHeader } from './agenda-header'
import { AgendaDiaView } from './agenda-dia-view'
import { AgendaMesView } from './agenada-mes-view'
import { AgendaSemanaView } from './agenada-semana-view'
import { AgendaResponse, Details } from '../types/interfaces'
import type { BranchSchedule } from '@/features/configuracion/services/configuracion.service'
import { getScheduleWarning, isClosedDay } from '../utils/agenda-schedule'
interface AgendaBoardProps{
  data?: AgendaResponse
  onSelected: (cita: Details)=> void
  schedules?: BranchSchedule[]
}
export function AgendaBoard({data, onSelected, schedules}: AgendaBoardProps) {
  const [vista, setVista] = useState('Día')
  const timezone = data?.timezone ?? 'America/La_Paz'
  const agendaData = (data?.appointments ?? []).map((appointment) => ({
    ...appointment,
    scheduleWarning: getScheduleWarning(appointment.scheduledAt, timezone, schedules),
  }))
  const [currentDate, setCurrentDate] = useState(() => new Date(`${dateKey(new Date(), timezone)}T12:00:00`))

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
  const { dayAppointments: citasDelDia, week: semanaAgrupada, month: mesAgrupado } =
    buildAgendaCalendar(agendaData, currentDate, timezone)
  const dayClosed = isClosedDay(currentDate, schedules)
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      <Card className={`gap-0 p-0 ${vista === 'Día' && dayClosed ? 'border-yellow-400 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-950/40' : ''}`}>
        <AgendaHeader
          vista={vista}
          currentDate={currentDate}
          onPrev={prevPeriod}
          onNext={nextPeriod}
          onChangeView={setVista}
        />

        {vista === 'Día' && dayClosed && (
          <p className="border-b border-yellow-300 px-4 py-3 text-sm font-medium text-yellow-950 dark:border-yellow-700 dark:text-yellow-100">
            Día sin atención configurada. Las citas registradas siguen visibles.
          </p>
        )}

        {vista === 'Día' && (
          <AgendaDiaView 
            appointments={citasDelDia} 
            onSelected={(cita)=>{
              //console.log('[AgendaBoard → DiaView] Cita recibida:', { id: cita.id, cliente: cita.clientFullName, hora: cita.hora });
              onSelected(cita);
            }}
            />
          )}

        {vista === 'Semana' && (
          <AgendaSemanaView 
            week={semanaAgrupada} 
            schedules={schedules}
            onSelected={(cita)=>{
              console.log('[AgendaBoard → SemanaView] Cita recibida:', { id: cita.id, cliente: cita.clientFullName, hora: cita.hora });
              onSelected(cita);
            }}
            />
          )}

        {vista === 'Mes' && (
          <AgendaMesView 
            weeks={mesAgrupado} timezone={timezone}
            onSelected={(cita)=>{
              console.log('[AgendaBoard → MesView] Cita recibida:', { id: cita.id, cliente: cita.clientFullName, hora: cita.hora });
              onSelected(cita);
            }}
          />
        )}
      </Card>

      <div className="space-y-4">
        {!!schedules?.length && (
          <p className="rounded-md border border-yellow-400 bg-yellow-100 p-3 text-sm text-yellow-950 dark:border-yellow-600 dark:bg-yellow-950/60 dark:text-yellow-100">
            Amarillo: fuera de los días u horarios de atención configurados.
          </p>
        )}
        <Card className="gap-3 p-5">
          <h3 className="font-semibold">Resumen del día</h3>
          {(() => {
            const total = citasDelDia.length
            const atendidas = citasDelDia.filter((c) => c.status === 'COMPLETED').length
            const pendientes = citasDelDia.filter((c) => c.status === 'PENDING').length
            const confirmadas = citasDelDia.filter((c) => c.status === 'CONFIRMED').length
            const canceladas = citasDelDia.filter((c) => c.status === 'CANCELLED' || c.status === 'NO_SHOW').length
            return (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Total citas</dt><dd className="font-medium">{total}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Atendidas</dt><dd className="font-medium text-success">{atendidas}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Confirmadas</dt><dd className="font-medium text-primary">{confirmadas}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Pendientes</dt><dd className="font-medium text-warning">{pendientes}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Canceladas / No asistió</dt><dd className="font-medium text-destructive">{canceladas}</dd></div>
              </dl>
            )
          })()}
        </Card>
      </div>
    </div>
  )
}
