import { PaymentMethod } from "@prisma/client";

export class PagoEntity {
  constructor(
    public readonly id: string,
    public readonly visitId: string,
    public readonly sucursalId: string,
    public readonly amount: number,
    public readonly method: PaymentMethod,
    public readonly reference: string,
    public readonly notes: string,
    public readonly paidAt: Date,
    public readonly createdAt: Date,
  ){}
}