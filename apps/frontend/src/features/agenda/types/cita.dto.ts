export interface CitaType{
  id: string,
  tenantId: string,
  sucursalId: string,
  clientId: string,
  userId: string,
  scheduledAt: Date,
  status: 'OPEN' | 'COMPLETED' | 'CANCELLED'
  createdAt: Date,
  updatedAt: Date  
}
export interface CreateCitaDto{
  clientId: string
  shceduledAt: Date
}
export interface UpdateCitaDto{
  id: string
  clientId: string
  shceduledAt: Date
}