import { Plan } from "@prisma/client";

export class CreateTenantDto {
  name: string;
  plan?: Plan;
}
