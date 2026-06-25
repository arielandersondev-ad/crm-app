
import { Prisma, UserRole } from "@prisma/client";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";

export abstract class MembershipRepository {
  abstract create(db: PrismaService | Prisma.TransactionClient, userId: string, tenantId: string, role: UserRole): Promise<any>;
  abstract findByUserId(userId: string): Promise<any>;
  abstract findById(id: string): Promise<any>
  abstract findAll(): Promise<any>
  abstract findByTenantId(tenantId: string): Promise<any>
  abstract update(db: PrismaService | Prisma.TransactionClient,id: string, userId: string, tenantId: string, role: UserRole): Promise<any>
  abstract updateRolByUser(db: PrismaService | Prisma.TransactionClient, userId: string, tenantId: string, role: UserRole): Promise<any>
  abstract delete(id: string): Promise<any>
}