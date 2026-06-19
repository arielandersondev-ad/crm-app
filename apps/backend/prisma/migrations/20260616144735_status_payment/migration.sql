-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('ACTIVE', 'VOIDED');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "voidedAt" TIMESTAMP(3);
