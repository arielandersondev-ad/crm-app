import { UseFormRegister } from "react-hook-form";
import { ServiceFormData } from "../schemas/service.schema";

interface ServiceFormProps {
  register: UseFormRegister<ServiceFormData>;
  errors?: Record<string, any>;
}

export function ServiceForm({ register, errors }: ServiceFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Nombre</label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          {...register("name")}
          className="w-full border rounded-md p-2"
          placeholder="Nombre del servicio"
        />

        {errors?.name && (
          <p className="text-red-500 text-sm">
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Descripcion</label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          {...register("description")}
          className="w-full border rounded-md p-2"
          placeholder="Descripcion del servicio"
        />

        {errors?.description && (
          <p className="text-red-500 text-sm">
            {errors.description.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Precio</label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          type="number"
          {...register("basePrice", {valueAsNumber: true})}
          className="w-full border rounded-md p-2"
          placeholder="Precio del servicio"
        />

        {errors?.basePrice && (
          <p className="text-red-500 text-sm">
            {errors.basePrice.message}
          </p>
        )}
      </div>
    </div>
  );
}
