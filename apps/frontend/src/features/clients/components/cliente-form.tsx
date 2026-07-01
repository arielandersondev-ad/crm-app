import { UseFormRegister } from "react-hook-form";
import { ClientFormData } from "../schemas/client.schema";

interface ClientFormProps {
  register: UseFormRegister<ClientFormData>;
  errors?: Record<string, any>;
}

export function ClientForm({ register, errors }: ClientFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Nombre Completo</label>
          <label className="text-sm text-muted-foreground">requerido</label>
        </div>

        <input
          {...register("fullName")}
          className="w-full border rounded-md p-2"
          placeholder="Nombre Apellido"
        />

        {errors?.fullName && (
          <p className="text-destructive text-sm">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Email</label>
          <label className="text-sm text-muted-foreground">requerido</label>
        </div>

        <input
          {...register("email")}
          type="email"
          className="w-full border rounded-md p-2"
        />

        {errors?.email && (
          <p className="text-destructive text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Teléfono</label>
          <label className="text-sm text-muted-foreground">requerido</label>
        </div>

        <input
          {...register("phone")}
          className="w-full border rounded-md p-2"
        />

        {errors?.phone && (
          <p className="text-destructive text-sm">
            {errors.phone.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Número de Documento</label>
          <label className="text-sm text-muted-foreground">opcional</label>
        </div>
        <input
          {...register("documentNumber")}
          className="w-full border rounded-md p-2"
          placeholder="DNI, CI, etc."
        />
        {errors?.documentNumber && (
          <p className="text-destructive text-sm">
            {errors.documentNumber.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Fecha de Nacimiento</label>
          <label className="text-sm text-muted-foreground">opcional</label>
        </div>
        <input
          {...register("birthDate")}
          type="date"
          className="w-full border rounded-md p-2"
        />
        {errors?.birthDate && (
          <p className="text-destructive text-sm">
            {errors.birthDate.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Dirección</label>
          <label className="text-sm text-muted-foreground">opcional</label>
        </div>
        <input
          {...register("address")}
          className="w-full border rounded-md p-2"
        />
        {errors?.address && (
          <p className="text-destructive text-sm">
            {errors.address.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Notas</label>
          <label className="text-sm text-muted-foreground">opcional</label>
        </div>
        <input
          {...register("notes")}
          className="w-full border rounded-md p-2"
        />
        {errors?.notes && (
          <p className="text-destructive text-sm">
            {errors.notes.message}
          </p>
        )}
      </div>

      <h3 className="font-semibold pt-4 border-t">Antecedentes Clínicos</h3>

      <div>
        <label className="block mb-1">Antecedentes médicos</label>
        <textarea
          {...register("antecedentes")}
          className="w-full border rounded-md p-2"
          rows={3}
          placeholder="Enfermedades previas, cirugías, tratamientos..."
        />
      </div>

      <div>
        <label className="block mb-1">Alergias</label>
        <textarea
          {...register("alergias")}
          className="w-full border rounded-md p-2"
          rows={2}
          placeholder="Alergias a medicamentos, látex, etc."
        />
      </div>

      <div>
        <label className="block mb-1">Contacto de emergencia</label>
        <input
          {...register("contactoEmergencia")}
          className="w-full border rounded-md p-2"
          placeholder="Nombre y teléfono"
        />
      </div>

      <div>
        <label className="block mb-1">Observaciones</label>
        <textarea
          {...register("observaciones")}
          className="w-full border rounded-md p-2"
          rows={2}
          placeholder="Información adicional relevante"
        />
      </div>
    </div>
  );
}