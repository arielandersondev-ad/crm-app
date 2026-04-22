export abstract class AuthRepository {
  abstract login(): Promise<string>;
  abstract register(): Promise<string>;
}