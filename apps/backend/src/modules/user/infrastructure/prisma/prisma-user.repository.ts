import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repositoriy';
import { PrismaService } from '../../../../common/infrastructure/database/prisma/prisma.service';
import { User } from "../../domain/entities/user.entity";
import { Prisma } from '@prisma/client';

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

  async update(id: string, email?: string, password?: string, firstName?: string, lastName?: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
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
}