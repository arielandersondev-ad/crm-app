/*
  Warnings:

  - You are about to drop the column `proximoControl` on the `Consultation` table. All the data in the column will be lost.
  - Made the column `motivo` on table `Consultation` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('DRAFT', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "proximoControl",
ADD COLUMN     "consultationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nextControlAt" TIMESTAMP(3),
ADD COLUMN     "status" "ConsultationStatus" NOT NULL DEFAULT 'DRAFT',
ALTER COLUMN "motivo" SET NOT NULL;
