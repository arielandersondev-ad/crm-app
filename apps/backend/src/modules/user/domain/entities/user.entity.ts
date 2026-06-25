export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string | null,
    public readonly lastName: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
export class UserSucursal {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly sucursalId: string,
  ) {}
}