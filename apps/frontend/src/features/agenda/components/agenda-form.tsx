import { UseFormRegister } from "react-hook-form";
import { Client } from "@/features/clients/types/client";
import { AgendaFormData } from "../schemas/agenda.schema";

interface AgendaFormProps {
  mode: "create" | "edit";
  currentClient?: Client | null
  register: UseFormRegister<AgendaFormData>;
  errors?: Record<string, any>;
}
export function AgendaForm({ mode, currentClient, register}: AgendaFormProps) {
  return (
    <div className="space-y-4 flex flex-row justify-evenly gap-2">
      {currentClient!==null && 
        <div className="flex flex-col justify-center">
          <label className="block mb-1 text-muted-foreground">Paciente</label>
          <input disabled readOnly className="w-full border rounded-md p-2" value={currentClient?.fullName?.toUpperCase()} />
        </div>
      }
      <div>
        <label className="block mb-1 text-muted-foreground">Programado para</label>
        <input
          type="datetime-local"
          {...register("scheduledAt")}
          className="w-full border rounded-md p-2"
        />
      </div>
    </div>
  );
}