import { Prisma } from "@prisma/client";
import { UserSucursal } from "../entities/user.entity";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";

export abstract class UserSucursalRepository {
  abstract assignSucursal(db: PrismaService | Prisma.TransactionClient, userId: string, sucursalId: string): Promise<UserSucursal>
  abstract updateSucursalUser(db: PrismaService | Prisma.TransactionClient, userId: string, sucursalId: string): Promise<UserSucursal>
}