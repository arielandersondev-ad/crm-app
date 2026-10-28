import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export function validationExceptionFactory(errors: ValidationError[]): BadRequestException {
  const messages = (items: ValidationError[], parent = ''): string[] =>
    items.flatMap((error) => {
      const field = parent ? `${parent}.${error.property}` : error.property;
      return [
        ...Object.entries(error.constraints ?? {}).map(([constraint, message]) =>
          constraint === 'whitelistValidation'
            ? `El campo «${field}» no está permitido en esta solicitud.`
            : message,
        ),
        ...messages(error.children ?? [], field),
      ];
    });

  return new BadRequestException({
    statusCode: 400,
    error: 'Solicitud inválida',
    message: messages(errors),
  });
}
