import { Details } from "../types/interfaces"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion"
import type { BranchSchedule } from "@/features/configuracion/services/configuracion.service"
import { isClosedDay, OUTSIDE_SCHEDULE_CLASSES } from "../utils/agenda-schedule"
import { cn } from "@/shared/utils/utils"

interface WeekDay {
  fecha: Date
  citas: Details[]
}

interface Props {
  week: WeekDay[]
  onSelected: (c:any)=>void
  schedules?: BranchSchedule[]
}

export function AgendaSemanaView({ week, onSelected, schedules }: Props) {

  return (
    <div className="p-4">
      <Accordion
        type="multiple"
        defaultValue={
          week
            .filter((d) => d.citas.length > 0)
            .map((d) => d.fecha.toISOString())
        }
      >
        {week.map((dia) => {
          const value = dia.fecha.toISOString()

          return (
            <AccordionItem
              key={value}
              value={value}
            >
              <AccordionTrigger className={isClosedDay(dia.fecha, schedules) ? 'bg-yellow-100 px-3 text-yellow-950 dark:bg-yellow-950/60 dark:text-yellow-100' : undefined}>
                <div className="flex gap-4">
                  <span>
                    {dia.fecha.toLocaleDateString('es-BO', {
                      weekday: 'short',
                    })}
                  </span>

                  <span>
                    {dia.fecha.getDate()}
                  </span>

                  <span>
                    ({dia.citas.length})
                  </span>
                  {isClosedDay(dia.fecha, schedules) && <span>Sin atención</span>}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                {dia.citas.map((cita) => (
                  <div
                    key={cita.id}
                    className={cn("mb-2 rounded border p-2", cita.scheduleWarning && OUTSIDE_SCHEDULE_CLASSES)}
                    title={cita.scheduleWarning ?? undefined}
                    onClick={()=>onSelected(cita)}
                  >
                    {cita.hora} - {cita.clientFullName}
                    {cita.scheduleWarning && <p className="mt-1 text-xs font-medium text-yellow-950 dark:text-yellow-100">{cita.scheduleWarning}</p>}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
