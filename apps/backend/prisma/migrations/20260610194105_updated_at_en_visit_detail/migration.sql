/*
  Warnings:

  - Added the required column `updatedAt` to the `VisitDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VisitDetail" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
