export class VisitDetailEntity {
  constructor(
    public readonly id: string,
    public readonly visitId: string,  
    public readonly serviceId: string,
    public readonly quantity: number,
    public readonly serviceName: string,
    public readonly unitPrice: number,
    public readonly totalPrice: number,
    public readonly notes: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
