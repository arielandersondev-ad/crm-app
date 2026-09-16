import { PrismaService } from '../../../../common/infrastructure/database/prisma/prisma.service';
import { PrismaChatLogRepository } from './prisma-chat-log.repository';

describe('PrismaChatLogRepository.findRecentByTenant', () => {
  it('combina tenant, fecha mínima y orden reciente para toda la ventana', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const prisma = {
      chatLog: { findMany },
    } as unknown as PrismaService;
    const repository = new PrismaChatLogRepository(prisma);
    const since = new Date('2026-09-13T12:00:00.000Z');

    await repository.findRecentByTenant('tenant-a', since);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        tenantId: 'tenant-a',
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
    });
  });
});
