export interface Service {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateServiceDto {
  name: string;
  basePrice: number;
  description?: string | undefined;
  isActive?: boolean | undefined;
}
export interface UpdateServiceDto{
  id?: string;
  name?: string | undefined;
  basePrice?: number | undefined;
  description?: string | undefined;
  isActive?: boolean | undefined;
}