import { Plan } from "@prisma/client";

export class UpdateTenantDto {
  id: string;
  name?: string;
  plan?: Plan;
}
