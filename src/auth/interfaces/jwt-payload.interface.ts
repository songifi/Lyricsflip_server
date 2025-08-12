import { Role } from '../roles/role.enum';

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  username: string;
  iat?: number;
  exp?: number;
  roles?: Role[] | undefined;
}
