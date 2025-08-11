import { Role } from '../enums/role';

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}
