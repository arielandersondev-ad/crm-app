
import { UserRole } from "@prisma/client";

export abstract class MembershipRepository {
  abstract create(userId: string, tenantId: string, role: UserRole): Promise<any>;
  abstract findByUserId(userId: string): Promise<any>;
  abstract findById(id: string): Promise<any>
  abstract findAll(): Promise<any>
  abstract update(id: string, userId: string, tenantId: string, role: UserRole): Promise<any>
  abstract delete(id: string): Promise<any>
}