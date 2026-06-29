/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `Consultation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "appointmentId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_appointmentId_key" ON "Consultation"("appointmentId");

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
