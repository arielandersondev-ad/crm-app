import { UseFormRegister } from "react-hook-form";
import { CreateUserFormData, EditUserFormData } from "../schemas/user.schema";

type UserFormData = CreateUserFormData | EditUserFormData;
import { Sucursal } from "../types/user";

interface UserFormProps {
  isEdit: boolean
  sucursales: Sucursal[]
  register: UseFormRegister<UserFormData>;
  errors?: Record<string, any>;
}

export function UserForm({isEdit, sucursales, register, errors }: UserFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1">Email</label>
        <input
          {...register("email")}
          type="email"
          className="w-full border rounded-md p-2"
          placeholder="correo@ejemplo.com"
        />
        {errors?.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>
      {!isEdit && (
        <div>
          <label className="block mb-1">Contraseña</label>
          <input
            {...register("password")}
            type="password"
            className="w-full border rounded-md p-2"
            placeholder="Mínimo 8 caracteres"
          />
          {errors?.password && (
            <p className="text-destructive text-sm">{errors.password.message}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            {...register("firstName")}
            className="w-full border rounded-md p-2"
            placeholder="Nombre"
          />
          {errors?.firstName && (
            <p className="text-destructive text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Apellido</label>
          <input
            {...register("lastName")}
            className="w-full border rounded-md p-2"
            placeholder="Apellido"
          />
          {errors?.lastName && (
            <p className="text-destructive text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block mb-1">Rol</label>
        <select
          {...register("role")}
          className="w-full border rounded-md p-2"
        >
          <option value="">Seleccione un rol</option>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="EMPLOYEE">Empleado</option>
        </select>
        {errors?.role && (
          <p className="text-destructive text-sm">{errors.role.message}</p>
        )}
      </div>
      <div>
        <label className="block mb-1">Sucursales</label>
        <select
          {...register("sucursalId")}
          className="w-full border rounded-md p-2"
        >
          {sucursales.map((sucursal)=>(
            <option
              key={sucursal.id} 
              value={sucursal.id}
            >
              {sucursal.name}
            </option>
          ))}
        </select>
        {errors?.role && (
          <p className="text-destructive text-sm">{errors.role.message}</p>
        )}
      </div>
    </div>
  );
}
