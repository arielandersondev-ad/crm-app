import { Plan } from "@prisma/client";
import { Tenant } from "../entities/tenant.entity";

export abstract class TenantRepository {
  abstract findAll(): Promise<Tenant[]>;
  abstract findOne(id: string): Promise<Tenant | null>;
  abstract create(name: string, plan?: Plan): Promise<Tenant>;
  abstract update(id: string, name?: string, plan?: Plan): Promise<Tenant>; 
  abstract delete(id: string): Promise<Tenant>;
}
