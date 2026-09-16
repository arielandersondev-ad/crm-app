import { Module } from '@nestjs/common';
import { ChatbotController } from './presentation/http/chatbot.controller';
import { ChatQueryUseCase } from './application/use-cases/chat-query.use-case';
import { CreateFaqUseCase } from './application/use-cases/create-faq.use-case';
import { UpdateFaqUseCase } from './application/use-cases/update-faq.use-case';
import { DeleteFaqUseCase } from './application/use-cases/delete-faq.use-case';
import { ListFaqsUseCase } from './application/use-cases/list-faqs.use-case';
import { GetBotConfigUseCase } from './application/use-cases/get-bot-config.use-case';
import { UpdateBotConfigUseCase } from './application/use-cases/update-bot-config.use-case';
import { FaqRepository } from './domain/repositories/faq.repository';
import { ChatLogRepository } from './domain/repositories/chat-log.repository';
import { BotConfigRepository } from './domain/repositories/bot-config.repository';
import { PrismaFaqRepository } from './infrastructure/prisma/prisma-faq.repository';
import { PrismaChatLogRepository } from './infrastructure/prisma/prisma-chat-log.repository';
import { PrismaBotConfigRepository } from './infrastructure/prisma/prisma-bot-config.repository';
import { EmbeddingService } from './infrastructure/nlp/embedding.service';
import { SimilarityService } from './infrastructure/nlp/similarity.service';
import { HuggingFaceService } from './infrastructure/nlp/huggingface.service';
import { PrismaService } from '../../common/infrastructure/database/prisma/prisma.service';
import { TenantModule } from '../tenant/tenant.module';
import { CitaModule } from '../cita/cita.module';
import { GeneralConfigurationModule } from '../general-configuration/general-configuration.module';
import { BranchScheduleModule } from '../branch-schedule/branch-schedule.module';
import { SucursalModule } from '../sucursal/sucursal.module';
import { ReindexFaqsUseCase } from './application/use-cases/reindex-faqs.use-case';
import { AppointmentStatusHandler } from './application/handlers/appointment-status.handler';
import { ScheduleHandler } from './application/handlers/schedule.handler';
import { GeneralConfigurationRepository } from '../general-configuration/domain/repositories/general-configuration.repository';
import { BranchScheduleRepository } from '../branch-schedule/domain/repositories/branch-schedule.repository';
import { GenerateFaqSuggestionsUseCase } from './application/use-cases/generate-faq-suggestions.use-case';
import { FaqSuggestionSanitizer } from './application/services/faq-suggestion-sanitizer.service';
import { FaqSuggestionResponseValidator } from './application/services/faq-suggestion-response-validator.service';

@Module({
  imports: [
    TenantModule,
    CitaModule,
    GeneralConfigurationModule,
    BranchScheduleModule,
    SucursalModule,
  ],
  controllers: [ChatbotController],
  providers: [
    ChatQueryUseCase,
    CreateFaqUseCase,
    UpdateFaqUseCase,
    DeleteFaqUseCase,
    ListFaqsUseCase,
    GetBotConfigUseCase,
    UpdateBotConfigUseCase,
    EmbeddingService,
    SimilarityService,
    PrismaService,
    ReindexFaqsUseCase,
    AppointmentStatusHandler,
    ScheduleHandler,
    GenerateFaqSuggestionsUseCase,
    FaqSuggestionSanitizer,
    FaqSuggestionResponseValidator,
    { provide: FaqRepository, useClass: PrismaFaqRepository },
    { provide: ChatLogRepository, useClass: PrismaChatLogRepository },
    { provide: BotConfigRepository, useClass: PrismaBotConfigRepository },
    { provide: 'AI_PROVIDER', useClass: HuggingFaceService },
  ],
  exports: [FaqRepository, BotConfigRepository, ChatLogRepository],
})
export class ChatbotModule {}
