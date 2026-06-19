import { ClientType } from "@prisma/client"

export class Cliente {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly type: ClientType,
    public readonly fullName: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly documentNumber: string,
    public readonly birthday: string,
    public readonly address: string,
    public readonly notes: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ){}
}