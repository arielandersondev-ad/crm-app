-- CreateIndex
CREATE INDEX "Consultation_tenantId_consultationDate_idx" ON "Consultation"("tenantId", "consultationDate");

-- CreateIndex
CREATE INDEX "Consultation_tenantId_userId_consultationDate_idx" ON "Consultation"("tenantId", "userId", "consultationDate");

-- CreateIndex
CREATE INDEX "Consultation_tenantId_clientId_consultationDate_idx" ON "Consultation"("tenantId", "clientId", "consultationDate");
