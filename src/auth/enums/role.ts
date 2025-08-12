export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export const ALL_ROLES: ReadonlyArray<Role> = Object.freeze([
  Role.USER,
  Role.ADMIN,
]);
