import { Modal } from "@/shared/components/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { AGENDA_SCHEMA, AgendaFormData } from "../schemas/agenda.schema";
import { useForm } from "react-hook-form";
import { AgendaForm } from "./agenda-form";
import { SearchModal } from "@/shared/components/search-modal/search-modal";
import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useClients } from "@/features/clients/hooks/use-clients";
import { Client } from "@/features/clients/types/client";

interface AgendaModelProps {
  open: boolean;
  mode: 'create' | 'edit';
  loading?: boolean;
  currenCLient?: Client | undefined

  onClose: ()=> void;
  onSubmit: (values: any)=> Promise <void> | void
}
export function AgendaModal({ open,mode,loading, currenCLient ,onClose, onSubmit}:AgendaModelProps){
  const resolver = zodResolver(AGENDA_SCHEMA);
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<AgendaFormData>( { resolver } );

  //Estados
  const [showSelectorCLient, setShowSelectorCLient] = useState(false)
  const [clientSelect, setCLientSelect] = useState<Client>()

  //hooks
  const { data: clients, isLoading, isError } = useClients();
  const clientsOptions = clients?.map(client => ({
    id: client.id,
    label: client.fullName,
    description: client.isActive ? 'activo':'inactivo',
    client,
  })) ?? [];

  // para limpiar cuando se abre y cierra el modal
  useEffect(()=>{
    !currenCLient && setCLientSelect(undefined)
    reset({clientId: '', scheduledAt: ''})
  },[open,reset])

  const handleFormSubmit = useCallback(async (data: AgendaFormData) => {
    await onSubmit(data);
    reset({ clientId: '', scheduledAt: '' });
    setCLientSelect(undefined);
    onClose();
  }, [onSubmit, reset, onClose]);

  return (
    <Modal
      open={open}
      onClose={() => {
        reset({ clientId: '', scheduledAt: '' });
        setCLientSelect(undefined);
        onClose();
      }}
      title={mode==='create' ? 'Agendar Cita' : 'Editar Cita'}
      description={mode === "create" ? "Para quien es la Cita ?" : "Actualice los detalles de la Cita"}
    >
      <form
        onSubmit={handleSubmit(
          (data) => handleFormSubmit(data),
          (errors) => console.error('Errores de formulario:', errors)
        )}
        className="space-y-6"
      >
        {/* Mensaje de error general */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
            <p className="text-sm text-destructive font-medium">Por favor corrige los errores:</p>
            <ul className="text-xs text-destructive mt-1 ml-4 list-disc">
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>{String(value?.message || `Error en ${key}`)}</li>
              ))}
            </ul>
          </div>
        )}
        {!clientSelect &&
          <Button
            type="button"
            onClick={()=>setShowSelectorCLient(true)}
            className="bg-primary text-primary-foreground"
            >
            <Search/>
            Buscar Cliente
          </Button>
        }
        <AgendaForm
          mode={mode}
          currentClient={clientSelect||null}
          register={register}
          errors={errors}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              reset({ clientId: '', scheduledAt: '' });
              setCLientSelect(undefined);
              onClose();
            }}
            className="px-4 py-2 border rounded-md"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md cursor-pointer"
          >
            {loading ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
          </button>
        </div>
      </form>
      <SearchModal
        title="Seleccionar un Usuario"
        open= {showSelectorCLient}
        items={clientsOptions}
        onClose={()=>setShowSelectorCLient(false)}
        onSelect={(cliente)=>{
          setCLientSelect(cliente.client)
          setValue('clientId',cliente.id)
        }}
      />
    </Modal>
  )
}