import { User } from "@/shared/types/user";
import { Tenant } from "@/shared/types/tenant";
import { Branch } from "@/shared/types/branch";

export interface AuthResponse {
  user: User;
  tenant: Tenant;
  sucursal: Branch;
}