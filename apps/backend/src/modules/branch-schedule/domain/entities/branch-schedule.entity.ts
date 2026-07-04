export class BranchSchedule {
  constructor(
    public id: string,
    public sucursalId: string,
    public dayOfWeek: string,
    public openTime: string | null,
    public closeTime: string | null,
    public isOpen: boolean = true,
  ) {}
}
