import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { agendaService } from "../services/agenda.service"
import { AgendaResponse } from "../types/interfaces"

export function useCreateAgenda(){
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: agendaService.createAgenda,
    mutationKey:['createAgenda'],
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey: ['agenda']
      })
    }
  })
}

export function useGetAgenda(sucursalId: string){
  return useQuery<AgendaResponse>({
    queryKey:['agenda', sucursalId],
    queryFn: () => agendaService.getAgenda(),
    enabled: !!sucursalId
  })
}