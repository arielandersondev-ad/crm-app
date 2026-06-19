export class Sucursal {
  constructor(
    public id: string,
    public tenantId: string,
    public name: string,
    public direccion: string | null,
    public latitude: number,
    public longitude: number,
    public telefono: string | null,
    public correo: string | null,
    public isDefault: boolean = false,
    public timezone: string = 'America/La_Paz',
  ) {}
}