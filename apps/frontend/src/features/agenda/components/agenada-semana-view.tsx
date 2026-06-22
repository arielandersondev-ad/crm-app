import { useState } from "react"
import { Details } from "../types/interfaces"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion"

interface WeekDay {
  fecha: Date
  citas: Details[]
}

interface Props {
  week: WeekDay[]
  onSelected: (c:any)=>void
}

export function AgendaSemanaView({ week, onSelected }: Props) {

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
              <AccordionTrigger>
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
                </div>
              </AccordionTrigger>

              <AccordionContent>
                {dia.citas.map((cita) => (
                  <div
                    key={cita.id}
                    className="mb-2 rounded border p-2"
                    onClick={()=>onSelected(cita)}
                  >
                    {cita.hora} - {cita.clientFullName}
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