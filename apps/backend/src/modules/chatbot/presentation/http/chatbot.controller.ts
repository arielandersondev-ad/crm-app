import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { TenantRepository } from '../../../tenant/domain/repositories/tenant.repository';
import { GeneralConfigurationRepository } from '../../../general-configuration/domain/repositories/general-configuration.repository';
import { ChatQueryUseCase } from '../../application/use-cases/chat-query.use-case';
import { CreateFaqUseCase } from '../../application/use-cases/create-faq.use-case';
import { UpdateFaqUseCase } from '../../application/use-cases/update-faq.use-case';
import { DeleteFaqUseCase } from '../../application/use-cases/delete-faq.use-case';
import { ListFaqsUseCase } from '../../application/use-cases/list-faqs.use-case';
import { GetBotConfigUseCase } from '../../application/use-cases/get-bot-config.use-case';
import { UpdateBotConfigUseCase } from '../../application/use-cases/update-bot-config.use-case';
import { ChatQueryDto } from './dto/chat-query.dto';
import { PublicChatQueryDto } from './dto/public-chat-query.dto';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { UpdateBotConfigDto } from './dto/update-bot-config.dto';
import { ReindexFaqsUseCase } from '../../application/use-cases/reindex-faqs.use-case';
import { FaqRepository } from '../../domain/repositories/faq.repository';
import { GenerateFaqSuggestionsUseCase } from '../../application/use-cases/generate-faq-suggestions.use-case';
import { GenerateFaqSuggestionsDto } from './dto/generate-faq-suggestions.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatQueryUseCase: ChatQueryUseCase,
    private readonly createFaqUseCase: CreateFaqUseCase,
    private readonly updateFaqUseCase: UpdateFaqUseCase,
    private readonly deleteFaqUseCase: DeleteFaqUseCase,
    private readonly listFaqsUseCase: ListFaqsUseCase,
    private readonly getBotConfigUseCase: GetBotConfigUseCase,
    private readonly updateBotConfigUseCase: UpdateBotConfigUseCase,
    private readonly tenantRepo: TenantRepository,
    private readonly faqRepo: FaqRepository,
    private readonly reindexFaqsUseCase: ReindexFaqsUseCase,
    private readonly generalConfigRepo: GeneralConfigurationRepository,
    private readonly generateFaqSuggestionsUseCase: GenerateFaqSuggestionsUseCase,
  ) {}

  @Post('query')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async query(
    @Body() dto: ChatQueryDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.chatQueryUseCase.execute(dto.question, tenantId, userId);
  }

  @Post('faqs/reindex')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  async reindexFaqs(@CurrentUser('tenantId') tenantId: string) {
    return this.reindexFaqsUseCase.execute(tenantId);
  }

  @Post('faqs/suggestions/generate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async generateFaqSuggestions(
    @CurrentUser('tenantId') tenantId: string,
    @Body() dto: GenerateFaqSuggestionsDto,
  ) {
    return this.generateFaqSuggestionsUseCase.execute(tenantId, dto.useQwen);
  }

  @Post('public/query')
  async publicQuery(@Body() dto: PublicChatQueryDto) {
    const tenant = await this.tenantRepo.findBySlug(dto.tenantSlug);
    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }
    return this.chatQueryUseCase.execute(dto.question, tenant.id);
  }

  @Get('public/contact/:tenantSlug')
  async publicContact(@Param('tenantSlug') tenantSlug: string) {
    const tenant = await this.tenantRepo.findBySlug(tenantSlug);
    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }
    const faqs = await this.faqRepo.findActiveByTenant(tenant.id);
    const contactFaq = faqs.find(
      (f) => f.category === 'CONTACTO' || /contacto/i.test(f.question),
    );
    return {
      contact: contactFaq
        ? { question: contactFaq.question, answer: contactFaq.answer }
        : null,
    };
  }

  @Get('public/config/:tenantSlug')
  async publicConfig(@Param('tenantSlug') tenantSlug: string) {
    const tenant = await this.tenantRepo.findBySlug(tenantSlug);
    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }

    const [generalConfig, botConfig] = await Promise.all([
      this.generalConfigRepo.findByTenantId(tenant.id),
      this.getBotConfigUseCase.execute(tenant.id),
    ]);

    return {
      botName:
        generalConfig?.botName ?? botConfig?.botName ?? 'Asistente Virtual',
      welcomeMessage:
        generalConfig?.welcomeMessage ??
        '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?',
      disclaimer: generalConfig?.disclaimer ?? '',
      contact: {
        phone: tenant.phone,
        email: tenant.email,
        whatsapp: tenant.whatsapp,
      },
    };
  }

  @Get('faqs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  async listFaqs(@CurrentUser('tenantId') tenantId: string) {
    return this.listFaqsUseCase.execute(tenantId);
  }

  @Post('faqs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  async createFaq(
    @Body() dto: CreateFaqDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.createFaqUseCase.execute({ ...dto, tenantId });
  }

  @Patch('faqs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  async updateFaq(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.updateFaqUseCase.execute(id, dto);
  }

  @Delete('faqs/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  async deleteFaq(@Param('id') id: string) {
    return this.deleteFaqUseCase.execute(id);
  }

  @Get('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  async getConfig(@CurrentUser('tenantId') tenantId: string) {
    return this.getBotConfigUseCase.execute(tenantId);
  }

  @Patch('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OWNER')
  async updateConfig(
    @CurrentUser('tenantId') tenantId: string,
    @Body() dto: UpdateBotConfigDto,
  ) {
    return this.updateBotConfigUseCase.execute(tenantId, dto);
  }
}
