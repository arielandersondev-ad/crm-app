import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { TenantRepository } from "../../domain/repositories/tenant.repository";
import { Tenant } from "../../domain/entities/tenant.entity";
import { Plan, Prisma } from "@prisma/client";

@Injectable()
export class PrismaTenantRepository implements TenantRepository {
  constructor (private prisma: PrismaService) {}

  async findAll(): Promise<Tenant[]> {
    const tenants = await this.prisma.tenant.findMany();
    return tenants.map((t) => this.toEntity(t));
  }

  async findOne(id: string): Promise<Tenant | null> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) return null;
    return this.toEntity(tenant);
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant) return null;
    return this.toEntity(tenant);
  }

  async create(tx: Prisma.TransactionClient, name: string, plan: Plan = Plan.FREE, slug?: string): Promise<Tenant> {
    const tenant = await tx.tenant.create({
      data: { name, plan, slug },
    });
    return this.toEntity(tenant);
  }

  async update(id: string, name?: string, plan?: Plan, slug?: string, phone?: string, email?: string, whatsapp?: string, timezone?: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: { name, plan, slug, phone, email, whatsapp, timezone },
    });
    return this.toEntity(tenant);
  }

  async delete(id: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.delete({ where: { id } });
    return this.toEntity(tenant);
  }

  private toEntity(t: any): Tenant {
    return new Tenant(
      t.id, t.name, t.slug, t.plan,
      t.phone, t.email, t.whatsapp, t.timezone,
      t.createdAt, t.updatedAt,
    );
  }
}
