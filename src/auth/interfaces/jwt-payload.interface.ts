export interface JwtPayload {
  sub: string;
  email: string;
  roles?: string;
  iat?: number;
  exp?: number;
}
