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
    return tenants.map((tenant) => new Tenant(
      tenant.id,
      tenant.name,
      tenant.slug,
      tenant.plan,
      tenant.createdAt,
      tenant.updatedAt,
    ));
  }

  async findOne(id: string): Promise<Tenant | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });
    if (!tenant) return null;
    return new Tenant(
      tenant.id,
      tenant.name,
      tenant.slug,
      tenant.plan,
      tenant.createdAt,
      tenant.updatedAt,
    );
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });
    if (!tenant) return null;
    return new Tenant(
      tenant.id,
      tenant.name,
      tenant.slug,
      tenant.plan,
      tenant.createdAt,
      tenant.updatedAt,
    );
  }

  async create(tx: Prisma.TransactionClient, name: string, plan: Plan = Plan.FREE, slug?: string): Promise<Tenant> {
    const tenant = await tx.tenant.create({
      data: { name, plan, slug },
    });
    return tenant;
  }

  async update(id: string, name?: string, plan?: Plan, slug?: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.update({
      where: { id },
      data: { name, plan, slug },
    });
    return tenant;
  }

  async delete(id: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.delete({
      where: { id },
    });
    return tenant;
  }
}
