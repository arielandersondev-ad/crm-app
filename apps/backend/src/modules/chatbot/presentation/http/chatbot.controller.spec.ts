/* eslint-disable @typescript-eslint/unbound-method */

import { GUARDS_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import type { ExecutionContext } from '@nestjs/common';
import { validate } from 'class-validator';
import { ROLES_KEY } from '../../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../../auth/infrastructure/security/jwt-auth.guard';
import { ChatbotController } from './chatbot.controller';
import { GenerateFaqSuggestionsDto } from './dto/generate-faq-suggestions.dto';

describe('ChatbotController FAQ suggestions security', () => {
  const handler = ChatbotController.prototype.generateFaqSuggestions;

  it('restringe la generación exclusivamente a OWNER', () => {
    expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual(['OWNER']);
  });

  it('protege la ruta con JWT y RolesGuard', () => {
    expect(Reflect.getMetadata(GUARDS_METADATA, handler)).toEqual([
      JwtAuthGuard,
      RolesGuard,
    ]);
  });

  it.each(['ADMIN', 'MANAGER', 'EMPLOYEE'])(
    'deniega el análisis a %s',
    (role) => {
      const guard = new RolesGuard(new Reflector());
      const context = {
        getHandler: () => handler,
        getClass: () => ChatbotController,
        switchToHttp: () => ({ getRequest: () => ({ user: { role } }) }),
      } as unknown as ExecutionContext;

      expect(() => guard.canActivate(context)).toThrow('no tienes permisos');
    },
  );

  it('permite el análisis a OWNER', () => {
    const guard = new RolesGuard(new Reflector());
    const context = {
      getHandler: () => handler,
      getClass: () => ChatbotController,
      switchToHttp: () => ({ getRequest: () => ({ user: { role: 'OWNER' } }) }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('acepta solo un booleano real para useQwen', async () => {
    const validDto = Object.assign(new GenerateFaqSuggestionsDto(), {
      useQwen: true,
    });
    const stringDto = Object.assign(new GenerateFaqSuggestionsDto(), {
      useQwen: 'true',
    });
    const missingDto = new GenerateFaqSuggestionsDto();

    await expect(validate(validDto)).resolves.toHaveLength(0);
    await expect(validate(stringDto)).resolves.not.toHaveLength(0);
    await expect(validate(missingDto)).resolves.not.toHaveLength(0);
  });
});
