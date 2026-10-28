import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateClienteDto } from '../../modules/cliente/presentation/dto/create-cliente.dto';
import { UpdateClienteDto } from '../../modules/cliente/presentation/dto/update-cliente.dto';
import { validationExceptionFactory } from './validation-exception.factory';

describe('Validación de pacientes en español', () => {
  const pipe = new ValidationPipe({
    whitelist: true, transform: true, forbidNonWhitelisted: true,
    exceptionFactory: validationExceptionFactory,
  });
  const patient = { fullName: 'Paciente de prueba', email: 'paciente@example.com', phone: '70000001', birthDate: '1990-06-15' };

  it.each([CreateClienteDto, UpdateClienteDto])('acepta datos personales sin antecedentes con %p', async (metatype) => {
    await expect(pipe.transform(patient, { type: 'body', metatype })).resolves.toMatchObject(patient);
  });

  it.each([undefined, ''])('permite omitir o vaciar la fecha opcional: %p', async (birthDate) => {
    await expect(pipe.transform({ ...patient, birthDate }, { type: 'body', metatype: UpdateClienteDto })).resolves.toBeDefined();
  });

  it('rechaza campos clínicos en el endpoint personal con un mensaje en español', async () => {
    try {
      await pipe.transform({ ...patient, antecedentes: '' }, { type: 'body', metatype: UpdateClienteDto });
      throw new Error('Se esperaba un error de validación');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toMatchObject({
        statusCode: 400,
        message: ['El campo «antecedentes» no está permitido en esta solicitud.'],
      });
    }
  });

  it('explica en español un correo inválido y una fecha imposible', async () => {
    try {
      await pipe.transform({ ...patient, email: 'incorrecto', birthDate: '1990-02-30' }, { type: 'body', metatype: UpdateClienteDto });
      throw new Error('Se esperaba un error de validación');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toMatchObject({
        message: expect.arrayContaining(['Ingrese un correo electrónico válido', 'Ingrese una fecha de nacimiento válida']),
      });
    }
  });
});
