import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repositoriy';
import { PrismaService } from '../../../../common/infrastructure/database/prisma/prisma.service';
import { User } from "../../domain/entities/user.entity";
import { Prisma } from '@prisma/client';
import { Sucursal } from '../../../sucursal/domain/entities/sucursal.entity';
import { TenantUserResponseDto } from '../../presentation/dto/findByTenantPayload.dto';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new User(
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.isActive,
      user.createdAt,
      user.updatedAt,
    ));
  }
  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) return null
      return new User(
        user.id,
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.isActive,
        user.createdAt,
        user.updatedAt,
      );
    } catch (error) {
      throw error;
    }
  }
  async findByTenant(tenantId: string): Promise<any[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          memberships: {
            some: {
              tenantId
            }
          }
        },
        select:{
          id:true,
          firstName:true,
          lastName:true,
          isActive:true,
          email:true,
          memberships: {
            select:{
              role:true
            }
          },
          sucursales:{
            include:{
              sucursal: {
                select: {
                  name:true    
                }
              }
            }
          },
        },
        
      });
      return users.map(user => ({
        id: user.id,
        fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        email: user.email,
        isActive: user.isActive,
        role: user.memberships[0]?.role ?? '',
        sucursal: user.sucursales[0]?.sucursal?.name ?? '',
      }));
    } catch (error) {
      throw error;
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) return null
      return new User(
        user.id,
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.isActive,
        user.createdAt,
        user.updatedAt,
      );
    } catch (error) {
      throw error;
    }
  }

  async create(db: PrismaService | Prisma.TransactionClient, email: string, password: string, firstName: string, lastName: string): Promise<User> {

    try {
      const user = await db.user.create({
        data: {
          email,
          password,
          firstName,
          lastName,
        },
      });
      return new User(
        user.id,
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.isActive,
        user.createdAt,
        user.updatedAt,
      );
    } catch (error) {
      throw error;
    }
  }

  async update(db: PrismaService | Prisma.TransactionClient, id: string, email?: string, password?: string, firstName?: string, lastName?: string): Promise<User> {
    try {
      const user = await db.user.update({
        where: {
          id,
        },
        data: {
          email,
          password,
          firstName,
          lastName,
        },
      });
      return new User(
        user.id,
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.isActive,
        user.createdAt,
        user.updatedAt,
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return new User(
        user.id,
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.isActive,
        user.createdAt,
        user.updatedAt,
      );
    } catch (error) {
      throw error;
    }
  }
  async  deactivate(id: string): Promise<User>{
    try {
      const user = await this.prisma.user.update({
        where: {
          id
        },
        data: {
          isActive: false
        }
      })
      return user
    } catch (error) {
      throw error
    }
  }
  async  activate(id: string): Promise<User>{
    try {
      const user = await this.prisma.user.update({
        where: {
          id
        },
        data: {
          isActive: true
        }
      })
      return user
    } catch (error) {
      throw error
    }
  }
}