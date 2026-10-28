import { CreateConsultationUseCase } from './create-consultation.use-case';
import { UpdateConsultationUseCase } from './update-consultation.use-case';
import { FindAgendaUseCase } from '../../../cita/application/use-cases/find-agenda.use-case';
import { ConsultationRepository } from '../../domain/repositories/consultation.repository';
import { ConsultationStatus } from '../../domain/entities/consultation.entity';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { SucursalRepository } from '../../../sucursal/domain/repositories/sucursal.repository';
import { PrismaService } from '../../../../common/infrastructure/database/prisma/prisma.service';

describe('Próximo control: consulta → cita → agenda', () => {
  let appointments: any[];
  let consultation: any;
  let repo: any;
  let citaRepo: any;
  let sucursalRepo: any;
  let prisma: any;
  let create: CreateConsultationUseCase;
  let update: UpdateConsultationUseCase;
  let agenda: FindAgendaUseCase;

  beforeEach(() => {
    appointments = [];
    consultation = { id: 'consulta-1', clientId: 'paciente-1', tenantId: 'empresa-1', status: ConsultationStatus.DRAFT };
    repo = {
      create: jest.fn(async (data) => (consultation = { ...consultation, ...data })),
      findById: jest.fn(async () => consultation),
      update: jest.fn(async (_id, _tenantId, data) => (consultation = { ...consultation, ...data })),
    };
    citaRepo = {
      findByClientId: jest.fn(async () => appointments),
      create: jest.fn(async (data) => {
        const appointment = { ...data, id: `cita-${appointments.length + 1}`, status: 'PENDING' };
        appointments.push(appointment);
        return appointment;
      }),
      getAgenda: jest.fn(async (tenantId, sucursalId) => appointments
        .filter((item) => item.tenantId === tenantId && item.sucursalId === sucursalId)
        .map((item) => ({ ...item, client: { fullName: 'Paciente de prueba' }, user: null }))),
    };
    sucursalRepo = { findById: jest.fn(async () => ({ timezone: 'America/La_Paz' })) };
    prisma = { auditLog: { create: jest.fn() }, appointment: { update: jest.fn() } };
    create = new CreateConsultationUseCase(repo as ConsultationRepository, citaRepo as CitaRepository, prisma as PrismaService, sucursalRepo as SucursalRepository);
    update = new UpdateConsultationUseCase(repo as ConsultationRepository, citaRepo as CitaRepository, prisma as PrismaService, sucursalRepo as SucursalRepository);
    agenda = new FindAgendaUseCase(citaRepo as CitaRepository, sucursalRepo as SucursalRepository);
  });

  it('guardar el 29/10 a las 15:00 crea una cita pendiente y la agenda devuelve 15:00', async () => {
    const result = await create.execute({ clientId: 'paciente-1', motivo: 'Control visual', nextControlAt: '2026-10-29T15:00', consultationDate: '2026-10-28T10:00' }, 'empresa-1', 'usuario-1', 'sucursal-1');
    expect(result.nextControlAt).toBe('2026-10-29T19:00:00.000Z');
    expect(repo.create.mock.calls[0][0].consultationDate).toBe('2026-10-28T14:00:00.000Z');
    expect(appointments).toHaveLength(1);
    expect(appointments[0]).toMatchObject({ status: 'PENDING', clientId: 'paciente-1', sucursalId: 'sucursal-1', scheduledAt: new Date('2026-10-29T19:00:00Z') });
    const response = await agenda.execute('empresa-1', 'sucursal-1');
    expect(response.appointments[0].hora).toBe('15:00');
  });

  it('una cita a las 10:00 del mismo día no impide crear el control a las 15:00', async () => {
    appointments.push({ id: 'cita-mañana', tenantId: 'empresa-1', sucursalId: 'sucursal-1', status: 'CONFIRMED', scheduledAt: new Date('2026-10-29T14:00:00Z') });
    await update.execute('consulta-1', { nextControlAt: '2026-10-29T15:00' }, 'empresa-1', 'usuario-1', 'sucursal-1');
    expect(appointments).toHaveLength(2);
    expect(appointments[1].scheduledAt.toISOString()).toBe('2026-10-29T19:00:00.000Z');
    expect(repo.update.mock.calls[0][2].nextControlAt).toBe('2026-10-29T19:00:00.000Z');
  });

  it('guardar de nuevo con hora local, UTC o desfase explícito no duplica la cita', async () => {
    await create.execute({ clientId: 'paciente-1', motivo: 'Control visual', nextControlAt: '2026-10-29T15:00' }, 'empresa-1', 'usuario-1', 'sucursal-1');
    for (const nextControlAt of ['2026-10-29T15:00', '2026-10-29T19:00:00Z', '2026-10-29T15:00:00-04:00']) {
      await update.execute('consulta-1', { nextControlAt }, 'empresa-1', 'usuario-1', 'sucursal-1');
    }
    expect(citaRepo.create).toHaveBeenCalledTimes(1);
    expect(appointments).toHaveLength(1);
  });

  it.each(['CANCELLED', 'NO_SHOW', 'COMPLETED'])('una cita %s no bloquea el control', async (status) => {
    appointments.push({ id: 'anterior', tenantId: 'empresa-1', sucursalId: 'sucursal-1', status, scheduledAt: new Date('2026-10-29T19:00:00Z') });
    await update.execute('consulta-1', { nextControlAt: '2026-10-29T15:00' }, 'empresa-1', 'usuario-1', 'sucursal-1');
    expect(citaRepo.create).toHaveBeenCalledTimes(1);
  });

  it('una cita de otra sucursal no impide crear el control', async () => {
    appointments.push({ id: 'otra', tenantId: 'empresa-1', sucursalId: 'sucursal-2', status: 'PENDING', scheduledAt: new Date('2026-10-29T19:00:00Z') });
    await update.execute('consulta-1', { nextControlAt: '2026-10-29T15:00' }, 'empresa-1', 'usuario-1', 'sucursal-1');
    expect(citaRepo.create).toHaveBeenCalledTimes(1);
  });

  it('finalizar sin próximo control no genera citas adicionales', async () => {
    await update.execute('consulta-1', { status: ConsultationStatus.COMPLETED }, 'empresa-1', 'usuario-1', 'sucursal-1');
    expect(citaRepo.create).not.toHaveBeenCalled();
  });

  it('utiliza la zona de la sucursal para controles cercanos a medianoche', async () => {
    sucursalRepo.findById.mockResolvedValue({ timezone: 'America/Lima' });
    await create.execute({ clientId: 'paciente-1', motivo: 'Control visual', nextControlAt: '2026-10-29T23:30' }, 'empresa-1', 'usuario-1', 'sucursal-1');
    expect(appointments[0].scheduledAt.toISOString()).toBe('2026-10-30T04:30:00.000Z');
    expect((await agenda.execute('empresa-1', 'sucursal-1')).appointments[0].hora).toBe('23:30');
  });
});
