import { Injectable } from "@nestjs/common";
import { ClienteRepository } from "../../domain/repository/cliente.repository";
import { Cliente } from "../../domain/entities/cliente.entity";
import { CreateClienteDto } from "../../presentation/dto/create-cliente.dto";
import { PrismaService } from "../../../../common/infrastructure/database/prisma/prisma.service";

@Injectable()
export class CreateClienteUseCase {
  constructor(
    private readonly clienteRepo: ClienteRepository,
    private readonly prisma: PrismaService,
  ) {}
  async execute(tenantId: string, userId: string, createClienteDto: CreateClienteDto): Promise<Cliente> {
    if (!tenantId) {
      throw new Error('La empresa es obligatoria');
    }
    if (!createClienteDto.fullName) {
      throw new Error('El nombre completo es obligatorio');
    }
    if (!createClienteDto.email) {
      throw new Error('El correo electrónico es obligatorio');
    }
    if (!createClienteDto.phone) {
      throw new Error('El teléfono es obligatorio');
    }
    const cliente = await this.clienteRepo.create(tenantId, createClienteDto.fullName, createClienteDto.email, createClienteDto.phone, createClienteDto.documentNumber, createClienteDto.birthDate, createClienteDto.address, createClienteDto.notes);

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        accion: "CREATE_CLIENTE",
        entidad: "Cliente",
        entidadId: cliente.id,
        detalle: `Creado paciente: ${cliente.fullName}`,
      },
    });

    return cliente;
  }
}
