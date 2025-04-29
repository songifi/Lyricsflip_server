// interfaces/jwt-payload.interface.ts
export interface JwtPayload {
    sub: string;
    email: string;
    iat?: number;
    exp?: number;
  }