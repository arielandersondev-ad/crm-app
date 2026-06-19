import { CreateServiceDto } from "../../presentation/dto/create.service.dto";
import { UpdateServiceDto } from "../../presentation/dto/update.service.dto";
import { ServiceEntity } from "../entities/service.entity";

export abstract class ServiceRepository {
  abstract findAllActive(tenantId: string): Promise<ServiceEntity[]>;
  abstract findById( id: string): Promise<ServiceEntity>;
  abstract create(tenantId: string, service: CreateServiceDto): Promise<ServiceEntity>;
  abstract update(tenantId: string, service: UpdateServiceDto): Promise<ServiceEntity>;
  abstract softDelete(tenantId: string, id: string): Promise<ServiceEntity>;
  abstract activate(tenantId: string, id: string): Promise<ServiceEntity>;
}