export interface Details{
  id:string,
  clientId: string,
  status:any,
  scheduledAt:string,
  hora:string,
  clientFullName: string,
  userName: string,
  visit:any
}
export interface AgendaResponse {
  timezone?: string
  appointments: Details[]
}