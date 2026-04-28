import { Controller, Get } from "@nestjs/common";

@Controller('sucursal')
export class SucursalController {

  @Get()
  async findAll() {
    return 'Sucursales';
  }
}
