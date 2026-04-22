import { UserRole } from "@prisma/client";

export class UpdateMembershipDto {
  id: string;
  userId: string;
  tenantId: string;
  role: UserRole;
}
