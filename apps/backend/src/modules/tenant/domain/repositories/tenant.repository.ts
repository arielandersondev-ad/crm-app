import { Prisma, Plan } from "@prisma/client";
import { Tenant } from "../entities/tenant.entity";

export abstract class TenantRepository {
  abstract findAll(): Promise<Tenant[]>;
  abstract findOne(id: string): Promise<Tenant | null>;
  abstract findBySlug(slug: string): Promise<Tenant | null>;
  abstract create(tx: Prisma.TransactionClient, name: string, plan?: Plan, slug?: string): Promise<Tenant>;
  abstract update(id: string, name?: string, plan?: Plan, slug?: string, phone?: string, email?: string, whatsapp?: string, timezone?: string): Promise<Tenant>;
  abstract delete(id: string): Promise<Tenant>;
}
