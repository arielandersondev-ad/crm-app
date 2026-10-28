import { PrismaClienteRepository } from './prisma-cliente.repository';
import { PrismaService } from '../../../../common/infrastructure/database/prisma/prisma.service';

describe('Fecha de nacimiento del paciente', () => {
  const storedPatient = {
    id: 'paciente-1', tenantId: 'empresa-1', type: 'PERSON', fullName: 'Paciente de prueba',
    phone: '70000001', email: 'paciente@example.com', birthDate: new Date('1990-06-15T00:00:00Z'),
  };
  const prisma = { client: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() } };
  const repository = new PrismaClienteRepository(prisma as unknown as PrismaService);

  beforeEach(() => jest.resetAllMocks());

  it('devuelve birthDate tanto en la tabla como en la ficha', async () => {
    prisma.client.findMany.mockResolvedValue([storedPatient]);
    prisma.client.findUnique.mockResolvedValue(storedPatient);
    const [listed] = await repository.findByTenantId('empresa-1');
    const detail = await repository.findById('paciente-1');
    for (const patient of [listed, detail]) {
      expect(JSON.parse(JSON.stringify(patient))).toMatchObject({ birthDate: '1990-06-15' });
      expect(patient).not.toHaveProperty('birthday');
    }
  });

  it('no borra la fecha si no se envía y permite borrarla explícitamente', async () => {
    prisma.client.update.mockResolvedValue(storedPatient);
    await repository.update('paciente-1', 'empresa-1', 'Paciente', 'paciente@example.com', '70000001', '');
    expect(prisma.client.update.mock.calls[0][0].data.birthDate).toBeUndefined();
    await repository.update('paciente-1', 'empresa-1', 'Paciente', 'paciente@example.com', '70000001', '', '');
    expect(prisma.client.update.mock.calls[1][0].data.birthDate).toBeNull();
  });
});
