import { Injectable } from "@nestjs/common";
import { DashboardRepository } from "../../domain/repositories/dashboard.repository";

@Injectable()
export class GetStatsUseCase {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async execute(tenantId: string, sucursalId: string) {
    return this.dashboardRepository.getStats(tenantId, sucursalId);
  }
}
