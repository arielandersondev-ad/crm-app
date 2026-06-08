import { UseFormRegister } from "react-hook-form";
import { VisitFormData } from "../schemas/visit.schema";
import { EntitySelector, SearchableItem } from "@/shared/components/search-modal";
import { useState } from "react";

interface VisitFormProps {
  clientId?: string;
  register: UseFormRegister<VisitFormData>;
  errors?: Record<string, any>;
}
export function VisitForm({ clientId, register, errors }: VisitFormProps) {
  const [selectedService, setSelectedService] = useState<SearchableItem>();
  const user = [
    {
      id: "1",
      label: "Corte de Cabello",
      description: "Bs. 30",
    },
    {
      id: "2",
      label: "Barba",
      description: "Bs. 20",
    },
  ];
  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Nombre del CLiente</label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          {...register("clientId")}
          className="w-full border rounded-md p-2"
          placeholder="Nombre del cliente"
        />

        {errors?.clientId && (
          <p className="text-red-500 text-sm">
            {errors.clientId.message}
          </p>
        )}
      </div>
      <div>
        <EntitySelector
          label="Nombre del Usuario"
          items={user}
          value={selectedService}
          placeholder="Seleccionar"
          onSelect={(user) =>{
            setSelectedService(user)
            console.log("user: ", user);
          }}
        />
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Nombre del Usuario</label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          //{...register("description")}
          className="w-full border rounded-md p-2"
          placeholder="Nombre del usuario"
        />

        {errors?.description && (
          <p className="text-red-500 text-sm">
            {errors.description.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Cita </label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          type="number"
          //{...register("basePrice", {valueAsNumber: true})}
          className="w-full border rounded-md p-2"
          placeholder="Cita"
        />

        {errors?.basePrice && (
          <p className="text-red-500 text-sm">
            {errors.basePrice.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row justify-between">
          <label className="block mb-1">Notas</label>
          <label className="text-sm text-red-300">requerido</label>
        </div>

        <input
          type="number"
          //{...register("basePrice", {valueAsNumber: true})}
          className="w-full border rounded-md p-2"
          placeholder="Notas"
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