export interface IJwtPayload {
  sub: string; // user id
  email: string;
  orgId: string;
  roleId: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}
