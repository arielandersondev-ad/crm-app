import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agendaService } from "../services/agenda.service";
import { UpdateCitaDto } from "../types/cita.dto";
import { toast } from "sonner";

export function useUpdateCita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCitaDto }) =>
      agendaService.updateCita(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agenda"] });
      toast.success("Estado de cita actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar la cita");
    },
  });
}
