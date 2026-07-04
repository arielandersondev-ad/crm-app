import { Plan } from "@prisma/client";

export class Tenant {
  constructor(
    public id: string,
    public name: string,
    public slug: string | null,
    public plan: Plan,
    public phone: string | null = null,
    public email: string | null = null,
    public whatsapp: string | null = null,
    public timezone: string = 'America/La_Paz',
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
