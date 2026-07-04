import { GeneralConfiguration } from "../entities/general-configuration.entity";

export abstract class GeneralConfigurationRepository {
  abstract findByTenantId(tenantId: string): Promise<GeneralConfiguration | null>;
  abstract upsert(tenantId: string, data: Partial<GeneralConfiguration>): Promise<GeneralConfiguration>;
}
