/*
  Warnings:

  - A unique constraint covering the columns `[userId,tenantId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Sucursal" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSucursal" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sucursalId" UUID NOT NULL,

    CONSTRAINT "UserSucursal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Sucursal_tenantId_idx" ON "Sucursal"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Sucursal_tenantId_name_key" ON "Sucursal"("tenantId", "name");

-- CreateIndex
CREATE INDEX "UserSucursal_sucursalId_idx" ON "UserSucursal"("sucursalId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSucursal_userId_sucursalId_key" ON "UserSucursal"("userId", "sucursalId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_tenantId_key" ON "Membership"("userId", "tenantId");

-- AddForeignKey
ALTER TABLE "Sucursal" ADD CONSTRAINT "Sucursal_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSucursal" ADD CONSTRAINT "UserSucursal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSucursal" ADD CONSTRAINT "UserSucursal_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
