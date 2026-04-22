import { Plan } from "@prisma/client";

export class Tenant {
  constructor(
    public id: string,
    public name: string,
    public plan: Plan,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}