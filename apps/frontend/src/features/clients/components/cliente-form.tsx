import { UseFormRegister } from "react-hook-form";
import { CreateClientDto } from "../types/client";

interface ClientFormProps {
  register: UseFormRegister<CreateClientDto>;
  errors?: Record<string, any>;
}

export function ClientForm({ register, errors }: ClientFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Nombre Completo</label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          {...register("fullName")}
          className="w-full border rounded-md p-2"
          placeholder="Nombre Apellido"
        />

        {errors?.fullName && (
          <p className="text-red-500 text-sm">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Email</label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          {...register("email")}
          type="email"
          className="w-full border rounded-md p-2"
        />

        {errors?.email && (
          <p className="text-red-500 text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Teléfono</label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          {...register("phone")}
          className="w-full border rounded-md p-2"
        />

        {errors?.phone && (
          <p className="text-red-500 text-sm">
            {errors.phone.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Número de Documento</label>
          <label className="text-sm text-green-300">opcional</label>
        </div>
        <input
          {...register("documentNumber")}
          className="w-full border rounded-md p-2"
          placeholder="DNI, CI, etc."
        />
        {errors?.documentNumber && (
          <p className="text-red-500 text-sm">
            {errors.documentNumber.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Fecha de Nacimiento</label>
          <label className="text-sm text-green-300">opcional</label>
        </div>
        <input
          {...register("birthDate")}
          type="date"
          className="w-full border rounded-md p-2"
        />
        {errors?.birthDate && (
          <p className="text-red-500 text-sm">
            {errors.birthDate.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Dirección</label>
          <label className="text-sm text-green-300">opcional</label>
        </div>
        <input
          {...register("address")}
          className="w-full border rounded-md p-2"
        />
        {errors?.address && (
          <p className="text-red-500 text-sm">
            {errors.address.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Notas</label>
          <label className="text-sm text-green-300">opcional</label>
        </div>
        <input
          {...register("notes")}
          className="w-full border rounded-md p-2"
        />
        {errors?.notes && (
          <p className="text-red-500 text-sm">
            {errors.notes.message}
          </p>
        )}
      </div>
    </div>
  );
}