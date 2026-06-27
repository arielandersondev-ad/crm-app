import { UseFormRegister } from "react-hook-form";
import { ConsultationFormData } from "../schemas/consultation.schema";
import { RefractionForm } from "./refraction-form";

interface ConsultationFormProps {
  register: UseFormRegister<ConsultationFormData>;
  errors?: Record<string, any>;
  readOnly?: boolean;
  clientName?: string;
}

const inputClass = "w-full border rounded-md p-2";
const labelClass = "block mb-1 text-sm font-medium";

function ClinicalSection({ register, errors, readOnly, clientName }: ConsultationFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Datos clínicos</h3>

      {clientName && (
        <div>
          <label className={labelClass}>Paciente</label>
          <p className="font-medium">{clientName}</p>
        </div>
      )}

      <div>
        <label className={labelClass}>Motivo de consulta *</label>
        <textarea
          {...register("motivo")}
          className={inputClass}
          rows={2}
          readOnly={readOnly}
          placeholder="Describa el motivo de la consulta"
        />
        {errors?.motivo && <p className="text-destructive text-sm">{errors.motivo.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Diagnóstico</label>
        <textarea
          {...register("diagnostico")}
          className={inputClass}
          rows={3}
          readOnly={readOnly}
          placeholder="Diagnóstico del paciente"
        />
      </div>

      <div>
        <label className={labelClass}>Próximo control</label>
        <input
          type="datetime-local"
          {...register("nextControlAt")}
          className={inputClass}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

function AdministrativeSection({ register, readOnly }: { register: UseFormRegister<ConsultationFormData>; readOnly?: boolean }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-muted-foreground">Notas administrativas</h3>

      <div>
        <label className={labelClass}>Observaciones</label>
        <textarea
          {...register("observaciones")}
          className={inputClass}
          rows={3}
          readOnly={readOnly}
          placeholder="Notas adicionales"
        />
      </div>
    </div>
  );
}

export function ConsultationForm({ register, errors, readOnly, clientName }: ConsultationFormProps) {
  return (
    <div className="space-y-6">
      <ClinicalSection register={register} errors={errors} readOnly={readOnly} clientName={clientName} />

      <div className="border-t pt-6">
        <RefractionForm register={register} readOnly={readOnly} />
      </div>

      <div className="border-t pt-6">
        <AdministrativeSection register={register} readOnly={readOnly} />
      </div>
    </div>
  );
}
