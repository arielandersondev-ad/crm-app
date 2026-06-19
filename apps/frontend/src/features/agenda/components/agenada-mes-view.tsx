import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion"
import { Details } from "../types/interfaces"

interface MonthWeek {
  numero: number
  inicio: Date
  fin: Date
  citas: Details[]
}

interface Props {
  weeks: MonthWeek[]
}

export function AgendaMesView({weeks}: Props) {
  return (
    <div className="space-y-4 p-4">
      <Accordion
        type="multiple"
        defaultValue={
          weeks
            .filter((w) => w.citas.length > 0)
            .map((w) => `week-${w.numero}`)
        }
      >
        {weeks.map((week) => (
          <AccordionItem
            key={week.numero}
            value={`week-${week.numero}`}
          >
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <span>
                  Semana {week.numero}
                </span>

                <span className="text-muted-foreground">
                  ({week.citas.length} citas)
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              {week.citas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sin citas
                </p>
              ) : (
                <div className="space-y-2">
                  {week.citas.map((cita) => (
                    <div
                      key={cita.id}
                      className="rounded border p-2"
                    >
                      <div className="font-medium">
                        {cita.clientFullName}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {new Date(cita.scheduledAt)
                          .toLocaleDateString('es-BO')}
                        {' - '}
                        {cita.hora}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}