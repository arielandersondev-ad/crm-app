import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { UserSucursal } from "../../domain/entities/user.entity";
import { UserSucursalRepository } from "../../domain/repositories/user-sucursal.repository";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaUserSucursalRepository implements UserSucursalRepository{
  constructor(
    private prisma: PrismaService
  ){}

  async assignSucursal(db: PrismaService | Prisma.TransactionClient, userId: string, sucursalId: string): Promise<UserSucursal> {

    const userSucursal = await db.userSucursal.create({
      data: {
        userId,
        sucursalId
      }
    })
    return new UserSucursal(
      userSucursal.id,
      userSucursal.sucursalId,
      userSucursal.userId,
    );
  }
  async updateSucursalUser( db: PrismaService | Prisma.TransactionClient, userId: string, sucursalId: string, ): Promise<UserSucursal> {
    const currentAssignment = await db.userSucursal.findFirst({
      where: {
        userId,
      },
    });
    let userSucursal: any;
    if (!currentAssignment) {
      userSucursal = await db.userSucursal.create({
        data: {
          userId,
          sucursalId,
        },
      });
    } else {
      userSucursal = await db.userSucursal.update({
        where: {
          id: currentAssignment.id,
        },
        data: {
          sucursalId,
        },
      });
    }

    return new UserSucursal(
      userSucursal.id,
      userSucursal.sucursalId,
      userSucursal.userId,
    );
  }
}