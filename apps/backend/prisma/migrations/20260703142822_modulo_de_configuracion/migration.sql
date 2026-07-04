-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "Sucursal" ADD COLUMN     "autoNoShowMinutes" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "avgConsultationMinutes" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "intervalBetweenAppointments" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/La_Paz',
ADD COLUMN     "whatsapp" TEXT;

-- CreateTable
CREATE TABLE "GeneralConfiguration" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "botName" TEXT NOT NULL DEFAULT 'Asistente Virtual',
    "welcomeMessage" TEXT NOT NULL DEFAULT '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?',
    "fallbackMessage" TEXT NOT NULL DEFAULT 'No encontré una respuesta exacta. Por favor, contáctanos al teléfono o correo de la clínica.',
    "disclaimer" TEXT NOT NULL DEFAULT '⚠️ Este asistente no realiza diagnósticos médicos ni reemplaza la consulta con un profesional de la salud.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchSchedule" (
    "id" UUID NOT NULL,
    "sucursalId" UUID NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "openTime" TEXT,
    "closeTime" TEXT,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BranchSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneralConfiguration_tenantId_key" ON "GeneralConfiguration"("tenantId");

-- CreateIndex
CREATE INDEX "BranchSchedule_sucursalId_idx" ON "BranchSchedule"("sucursalId");

-- CreateIndex
CREATE UNIQUE INDEX "BranchSchedule_sucursalId_dayOfWeek_key" ON "BranchSchedule"("sucursalId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "GeneralConfiguration" ADD CONSTRAINT "GeneralConfiguration_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchSchedule" ADD CONSTRAINT "BranchSchedule_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
