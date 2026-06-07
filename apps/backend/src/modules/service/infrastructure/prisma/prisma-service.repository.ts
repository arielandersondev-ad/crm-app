import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";
import { ServiceEntity } from "../../domain/entities/service.entity";
import { CreateServiceDto } from "../../presentation/dto/create.service.dto";
import { UpdateServiceDto } from "../../presentation/dto/update.service.dto";

@Injectable()
export class PrismaServiceRepository {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  async findAllActive(tenantId: string): Promise<ServiceEntity[]> {
    const services = await this.prismaService.service.findMany({
      where: {
        tenantId,
        isActive: true,
      },
    });
    return services.map((service) => new ServiceEntity(
      service.id,
      service.tenantId,
      service.name,
      service.description,
      service.basePrice.toNumber(),
      service.isActive,
      service.createdAt,
      service.updatedAt,
    ));
  }
  async create(tenantId: string, service: CreateServiceDto): Promise<ServiceEntity> {
    const createdService = await this.prismaService.service.create({
      data: {
        tenantId,
        ...service,
      },
    });
    return new ServiceEntity(
      createdService.id,
      createdService.tenantId,
      createdService.name,
      createdService.description,
      createdService.basePrice.toNumber(),
      createdService.isActive,
      createdService.createdAt,
      createdService.updatedAt,
    );
  }
  async update(tenantId: string, service: UpdateServiceDto): Promise<ServiceEntity> {
    const updatedService = await this.prismaService.service.update({
      where: {
        id: service.id,
        tenantId,
      },
      data: {
        ...service,
      },
    });
    return new ServiceEntity(
      updatedService.id,
      updatedService.tenantId,
      updatedService.name,
      updatedService.description,
      updatedService.basePrice.toNumber(),
      updatedService.isActive,
      updatedService.createdAt,
      updatedService.updatedAt,
    );
  }
  async softDelete(tenantId: string, id: string): Promise<ServiceEntity> {
    const deletedService = await this.prismaService.service.update({
      where: {
        id,
        tenantId,
      },
      data: {
        isActive: false,
      },
    });
    return new ServiceEntity(
      deletedService.id,
      deletedService.tenantId,
      deletedService.name,
      deletedService.description,
      deletedService.basePrice.toNumber(),
      deletedService.isActive,
      deletedService.createdAt,
      deletedService.updatedAt,
    );
  }
  async activate(tenantId: string, id: string): Promise<ServiceEntity> {
    const activatedService = await this.prismaService.service.update({
      where: {
        id,
        tenantId,
      },
      data: {
        isActive: true,
      },
    });
    return new ServiceEntity(
      activatedService.id,
      activatedService.tenantId,
      activatedService.name,
      activatedService.description,
      activatedService.basePrice.toNumber(),
      activatedService.isActive,
      activatedService.createdAt,
      activatedService.updatedAt,
    );
  }
}