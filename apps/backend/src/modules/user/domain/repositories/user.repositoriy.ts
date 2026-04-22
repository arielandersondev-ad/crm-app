import { User } from "../entities/user.entity";

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>;
  abstract findById(id: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract create(email: string, password: string, firstName: string, lastName: string): Promise<User>;
  abstract update(id: string, email?: string, password?: string, firstName?: string, lastName?: string): Promise<User>;
  abstract delete(id: string): Promise<User>;
}