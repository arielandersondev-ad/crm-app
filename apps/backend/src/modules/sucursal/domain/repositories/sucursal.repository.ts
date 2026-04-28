import { Sucursal } from "../entities/sucursal.entity";

export abstract class SucursalRepository {
  abstract findAll(): Promise<Sucursal[]>;
}