import { UseFormRegister } from "react-hook-form";
import { FaqFormData } from "../schemas/faq.schema";

interface FaqFormProps {
  register: UseFormRegister<FaqFormData>;
  errors?: Record<string, any>;
}

const CATEGORIES = [
  { value: "GENERAL", label: "General" },
  { value: "HORARIOS", label: "Horarios" },
  { value: "SERVICIOS", label: "Servicios" },
  { value: "PRECIOS", label: "Precios" },
  { value: "CONTACTO", label: "Contacto" },
  { value: "EMERGENCIAS", label: "Emergencias" },
  { value: "CITAS", label: "Citas" },
];

export function FaqForm({ register, errors }: FaqFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Pregunta</label>
          <label className="text-sm text-muted-foreground">requerido</label>
        </div>
        <textarea
          {...register("question")}
          className="w-full border rounded-md p-2"
          placeholder="¿Cuál es la pregunta frecuente?"
          rows={3}
        />
        {errors?.question && (
          <p className="text-destructive text-sm">{errors.question.message}</p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Respuesta</label>
          <label className="text-sm text-muted-foreground">requerido</label>
        </div>
        <textarea
          {...register("answer")}
          className="w-full border rounded-md p-2"
          placeholder="Escribe la respuesta"
          rows={5}
        />
        {errors?.answer && (
          <p className="text-destructive text-sm">{errors.answer.message}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Categoría</label>
        <select {...register("category")} className="w-full border rounded-md p-2">
          <option value="">Sin categoría</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
