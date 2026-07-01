import { UseFormRegister } from "react-hook-form";
import { ConsultationFormData } from "../schemas/consultation.schema";

interface RefractionFormProps {
  register: UseFormRegister<ConsultationFormData>;
  readOnly?: boolean;
}

const inputClass = "w-20 border rounded-md p-1.5 text-center text-sm";
const labelClass = "text-xs text-muted-foreground text-center block";
const headerClass = "text-xs font-semibold text-muted-foreground text-center px-2 py-1";

function RowLabel({ children }: { children: React.ReactNode }) {
  return <td className="font-medium text-sm px-2 py-2">{children}</td>;
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="px-1 py-1">{children}</td>;
}

function EyeSection({
  prefix,
  register,
  readOnly,
}: {
  prefix: "odLejos" | "oiLejos" | "odCerca" | "oiCerca";
  register: UseFormRegister<ConsultationFormData>;
  readOnly?: boolean;
}) {
  const label = prefix.startsWith("od") ? "OD" : "OI";
  return (
    <tr>
      <RowLabel>{label}</RowLabel>
      <Cell>
        <input {...register(`${prefix}Esf`)} className={inputClass} readOnly={readOnly} placeholder=" " />
      </Cell>
      <Cell>
        <input {...register(`${prefix}Cil`)} className={inputClass} readOnly={readOnly} placeholder=" " />
      </Cell>
      <Cell>
        <input {...register(`${prefix}Eje`)} className={inputClass} readOnly={readOnly} placeholder=" " />
      </Cell>
      <Cell>
        <input {...register(`${prefix}Av`)} className={`${inputClass} w-24`} readOnly={readOnly} placeholder=" " />
      </Cell>
    </tr>
  );
}

export function RefractionForm({ register, readOnly }: RefractionFormProps) {
  const thClass = "text-xs font-semibold text-muted-foreground text-center px-2 py-1 border-b";

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Refracción</h3>

      {/* LEJOS */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Lejos</p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thClass}></th>
              <th className={thClass}>ESF</th>
              <th className={thClass}>CIL</th>
              <th className={thClass}>EJE</th>
              <th className={thClass}>AV</th>
            </tr>
          </thead>
          <tbody>
            <EyeSection prefix="odLejos" register={register} readOnly={readOnly} />
            <EyeSection prefix="oiLejos" register={register} readOnly={readOnly} />
          </tbody>
        </table>
        <div className="flex items-center gap-2 mt-2">
          <label className={labelClass}>DIP</label>
          <input {...register("lejosDip")} className={inputClass} readOnly={readOnly} placeholder=" " />
        </div>
      </div>

      {/* CERCA */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Cerca</p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={thClass}></th>
              <th className={thClass}>ESF</th>
              <th className={thClass}>CIL</th>
              <th className={thClass}>EJE</th>
              <th className={thClass}>AV</th>
            </tr>
          </thead>
          <tbody>
            <EyeSection prefix="odCerca" register={register} readOnly={readOnly} />
            <EyeSection prefix="oiCerca" register={register} readOnly={readOnly} />
          </tbody>
        </table>
        <div className="flex items-center gap-2 mt-2">
          <label className={labelClass}>DIP</label>
          <input {...register("cercaDip")} className={inputClass} readOnly={readOnly} placeholder=" " />
        </div>
      </div>

      {/* ADD */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-muted-foreground">ADD</label>
        <input {...register("add")} className={inputClass} readOnly={readOnly} placeholder=" " />
      </div>
    </div>
  );
}
