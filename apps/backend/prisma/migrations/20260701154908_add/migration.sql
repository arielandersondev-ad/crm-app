-- CreateEnum
CREATE TYPE "FAQCategory" AS ENUM ('GENERAL', 'HORARIOS', 'SERVICIOS', 'PRECIOS', 'CONTACTO', 'EMERGENCIAS', 'CITAS');

-- CreateTable
CREATE TABLE "FAQ" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" "FAQCategory" NOT NULL DEFAULT 'GENERAL',
    "embedding" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotConfig" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "botName" TEXT NOT NULL DEFAULT 'Asistente Virtual',
    "welcomeMessage" TEXT NOT NULL DEFAULT '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?',
    "disclaimer" TEXT NOT NULL DEFAULT '⚠️ Este asistente no realiza diagnósticos médicos ni reemplaza la consulta con un profesional de la salud.',
    "fallbackMessage" TEXT NOT NULL DEFAULT 'No encontré una respuesta exacta. Por favor, contáctanos al teléfono o correo de la clínica.',
    "similarityThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.75,
    "mode" TEXT NOT NULL DEFAULT 'FAQ_ONLY',
    "modelProvider" TEXT NOT NULL DEFAULT 'huggingface',
    "embeddingModel" TEXT NOT NULL DEFAULT 'Xenova/all-MiniLM-L6-v2',
    "maxTokens" INTEGER NOT NULL DEFAULT 150,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatLog" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "userId" UUID,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "intent" TEXT,
    "confidence" DOUBLE PRECISION,
    "responseTime" INTEGER,
    "modelName" TEXT,
    "usedAI" BOOLEAN NOT NULL DEFAULT false,
    "resolved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FAQ_tenantId_isActive_idx" ON "FAQ"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BotConfig_tenantId_key" ON "BotConfig"("tenantId");

-- CreateIndex
CREATE INDEX "ChatLog_tenantId_createdAt_idx" ON "ChatLog"("tenantId", "createdAt");

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotConfig" ADD CONSTRAINT "BotConfig_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
