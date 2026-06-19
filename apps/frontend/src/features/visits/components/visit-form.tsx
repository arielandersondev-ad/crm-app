import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { VisitFormData } from "../schemas/visit.schema";
import { Client } from "@/features/clients/types/client";

interface VisitFormProps {
  mode: "create" | "edit";
  client?: Client;
  register: UseFormRegister<VisitFormData>;
  setValue: UseFormSetValue<VisitFormData>;
  watch: UseFormWatch<VisitFormData>;
  errors?: Record<string, any>;
}
export function VisitForm({ mode, client, register }: VisitFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-col md:flex-row justify-center gap-2">
          <label className="block mb-1 text-muted-foreground">VISITA PARA</label>
          <label className="text-sm text-muted-foreground">{client?.fullName?.toUpperCase() || '-'} </label>
          <input
            type="hidden"
            value={client?.id || ''}
            {...register("clientId")}
          />
        </div>
      </div>
      {mode === "edit" && (
        <>
          <div>
            <label>Estado</label>
            <select
              {...register("status")}
              className="w-full border rounded-md p-2"
            >
              <option value="OPEN">Abierta</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>

          <div>
            <label>Responsable</label>
            <input
              {...register("userId")}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label>Inicio</label>
            <input
              type="datetime-local"
              {...register("startedAt")}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label>Finalización</label>
            <input
              type="datetime-local"
              {...register("completedAt")}
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label>Notas</label>
            <input
              type="textarea"
              {...register("notes")}
              className="w-full border rounded-md p-2"
            />
          </div>
        </>
      )}
    </div>
  );
}