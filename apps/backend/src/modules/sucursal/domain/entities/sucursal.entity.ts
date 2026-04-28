export class Sucursal {
  constructor(
    public id: string,
    public nombre: string,
    public direccion: string,
    public latitude: number,
    public longitude: number,
    public telefono?: string,
    public correo?: string,
  ) {}
}