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
    public avgConsultationMinutes: number = 30,
    public intervalBetweenAppointments: number = 5,
    public autoNoShowMinutes: number = 30,
  ) {}
}