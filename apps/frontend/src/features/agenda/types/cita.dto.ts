export interface CitaType{
  id: string,
  tenantId: string,
  sucursalId: string,
  clientId: string,
  userId: string,
  scheduledAt: Date,
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  createdAt: Date,
  updatedAt: Date  
}
export interface CreateCitaDto{
  clientId: string
  scheduledAt: Date
}
export interface UpdateCitaDto{
  clientId: string
  scheduledAt: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
}