
import { User } from "../entities/user.entity";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { Prisma } from "@prisma/client";

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract create(db: PrismaService | Prisma.TransactionClient, email: string, password: string, firstName: string, lastName: string): Promise<User>;
  abstract update(id: string, email?: string, password?: string, firstName?: string, lastName?: string): Promise<User>;
  abstract delete(id: string): Promise<User>;
}