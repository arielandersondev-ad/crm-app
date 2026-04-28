import { Module } from "@nestjs/common";
import { SucursalController } from "./presentation/http/sucursal.controller";

@Module({
  controllers: [
    SucursalController,
  ],
  providers: [
  ],
  exports: [
  ],
})
export class SucursalModule { }