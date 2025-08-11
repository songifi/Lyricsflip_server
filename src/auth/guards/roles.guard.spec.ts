import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const createExecutionContext = (user?: { role?: string }) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as import('@nestjs/common').ExecutionContext;
  };

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows when no roles metadata is set', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce(undefined as any);

    const can = guard.canActivate(createExecutionContext({ role: Role.USER }));
    expect(can).toBe(true);
  });

  it('allows when user has required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Role.ADMIN]);

    const can = guard.canActivate(createExecutionContext({ role: Role.ADMIN }));
    expect(can).toBe(true);
  });

  it('denies when user is missing', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Role.ADMIN]);

    expect(() => guard.canActivate(createExecutionContext(undefined))).toThrow(
      ForbiddenException,
    );
  });

  it('denies when user lacks required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Role.ADMIN]);

    expect(() =>
      guard.canActivate(createExecutionContext({ role: Role.USER })),
    ).toThrow(ForbiddenException);
  });

  it('supports multiple allowed roles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValueOnce([Role.ADMIN, Role.USER]);

    const can = guard.canActivate(createExecutionContext({ role: Role.USER }));
    expect(can).toBe(true);
  });
});
