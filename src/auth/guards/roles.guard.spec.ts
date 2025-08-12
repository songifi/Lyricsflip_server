import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '../roles/role.enum';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const createMockExecutionContext = (user: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => {},
      getClass: () => {},
    }) as any;

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const mockContext = createMockExecutionContext({ roles: [Role.User] });
    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should deny access if user has no roles assigned', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);
    const mockContext = createMockExecutionContext({ roles: [] });
    expect(guard.canActivate(mockContext)).toBe(false);
  });

  it('should deny access if user does not have the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);
    const mockContext = createMockExecutionContext({ roles: [Role.User] });
    expect(guard.canActivate(mockContext)).toBe(false);
  });

  it('should allow access if user has the required admin role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);
    const mockContext = createMockExecutionContext({ roles: [Role.Admin] });
    expect(guard.canActivate(mockContext)).toBe(true);
  });
});
