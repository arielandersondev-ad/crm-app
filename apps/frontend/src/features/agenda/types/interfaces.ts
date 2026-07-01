export interface Details{
  id:string,
  clientId: string,
  status:any,
  scheduledAt:string,
  hora:string,
  clientFullName: string,
  userName: string,
  visit:any,
  consultation: { id: string; status: string } | null
}
export interface AgendaResponse {
  timezone?: string
  appointments: Details[]
}