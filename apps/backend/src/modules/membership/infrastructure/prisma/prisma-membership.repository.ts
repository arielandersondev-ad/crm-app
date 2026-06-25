import { Injectable } from "@nestjs/common";
import { MembershipRepository } from "../../domain/repositories/membership.repository";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { Prisma, UserRole } from "@prisma/client";

@Injectable()
export class PrismaMembershipRepository implements MembershipRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(db: PrismaService | Prisma.TransactionClient, userId: string, tenantId: string, role: UserRole) {
    try {
      return db.membership.create({
        data: {
          userId,
          tenantId,
          role: role as UserRole,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findByUserId(userId: string) {
    try {
      return this.prisma.membership.findMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findById(id: string) {
    try {
      return this.prisma.membership.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findAll() {
    try {
      return this.prisma.membership.findMany();
    } catch (error) {
      throw error;
    }
  }
  async findByTenantId(tenantId: string) {
    try {
      return this.prisma.membership.findMany({
        where: { tenantId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              isActive: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async update(db: PrismaService | Prisma.TransactionClient,id: string, userId: string, tenantId: string, role: UserRole) {
    try {
      return db.membership.update({
        where: {
          id,
        },
        data: {
          userId,
          tenantId,
          role: role as UserRole,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async updateRolByUser(db: PrismaService | Prisma.TransactionClient, userId: string, tenantId: string, role: UserRole) {
    try {
      return db.membership.update({
        where: {
          userId_tenantId:{userId,tenantId},
        },
        data: {
          role: role as UserRole,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string) {
    try {
      return this.prisma.membership.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
