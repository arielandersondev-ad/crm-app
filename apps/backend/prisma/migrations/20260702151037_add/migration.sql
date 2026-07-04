/*
  Warnings:

  - A unique constraint covering the columns `[appointmentCode]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "appointmentCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_appointmentCode_key" ON "Appointment"("appointmentCode");
