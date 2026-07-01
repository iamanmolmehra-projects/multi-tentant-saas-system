export interface IAuthenticatedUser {
  userId: string;
  email: string;
  orgId: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}
