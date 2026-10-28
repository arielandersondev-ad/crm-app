import { AppointmentStatusHandler } from './appointment-status.handler';
import { CitaRepository } from '../../../cita/domain/repositories/cita.repository';
import { SucursalRepository } from '../../../sucursal/domain/repositories/sucursal.repository';

describe('Consulta del estado de una cita en el chatbot', () => {
  const citaRepo = { findByCodeAndDocument: jest.fn() };
  const sucursalRepo = { findById: jest.fn() };
  const handler = new AppointmentStatusHandler(
    citaRepo as unknown as CitaRepository,
    sucursalRepo as unknown as SucursalRepository,
  );
  const question = 'Estado de APT-ABCDEF con CI 1234567';

  beforeEach(() => {
    jest.resetAllMocks();
    citaRepo.findByCodeAndDocument.mockResolvedValue({
      sucursalId: 'sucursal-1',
      scheduledAt: new Date('2026-10-28T14:00:00.000Z'),
      status: 'CONFIRMED',
      appointmentCode: 'APT-ABCDEF',
    });
    sucursalRepo.findById.mockResolvedValue({ timezone: 'America/La_Paz' });
  });

  it('muestra las 10 de la mañana de Bolivia para las 14 UTC', async () => {
    const result = await handler.tryHandle(question, 'empresa-1');
    expect(result?.answer).toContain('Hora: 10:00');
    expect(result?.answer).toMatch(/a\.?\s*m\.?/i);
    expect(result?.answer).toContain('Fecha: 28 de octubre de 2026');
    expect(result?.answer).toContain('Estado: Confirmada');
    expect(citaRepo.findByCodeAndDocument).toHaveBeenCalledWith('APT-ABCDEF', '1234567', 'empresa-1');
    expect(sucursalRepo.findById).toHaveBeenCalledWith('sucursal-1');
  });

  it('respeta la zona de la sucursal cuando es distinta a Bolivia', async () => {
    sucursalRepo.findById.mockResolvedValue({ timezone: 'America/Lima' });
    const result = await handler.tryHandle(question, 'empresa-1');
    expect(result?.answer).toContain('Hora: 09:00');
  });

  it('convierte también la fecha al cruzar medianoche UTC', async () => {
    citaRepo.findByCodeAndDocument.mockResolvedValue({
      sucursalId: 'sucursal-1', scheduledAt: new Date('2026-10-29T02:00:00Z'),
      status: 'PENDING', appointmentCode: 'APT-ABCDEF',
    });
    const result = await handler.tryHandle(question, 'empresa-1');
    expect(result?.answer).toContain('Fecha: 28 de octubre de 2026');
    expect(result?.answer).toContain('Hora: 10:00');
    expect(result?.answer).toMatch(/p\.?\s*m\.?/i);
  });

  it('usa Bolivia si la sucursal no está disponible', async () => {
    sucursalRepo.findById.mockResolvedValue(null);
    expect((await handler.tryHandle(question, 'empresa-1'))?.answer).toContain('Hora: 10:00');
  });

  it('no revela la cita cuando el código y el documento no coinciden', async () => {
    citaRepo.findByCodeAndDocument.mockResolvedValue(null);
    const result = await handler.tryHandle(question, 'empresa-1');
    expect(result?.source).toBe('Fallback');
    expect(result?.answer).toContain('Verifique el código y el documento');
    expect(sucursalRepo.findById).not.toHaveBeenCalled();
  });
});
