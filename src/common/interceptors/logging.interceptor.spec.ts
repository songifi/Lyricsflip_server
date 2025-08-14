import { Test } from '@nestjs/testing';
import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          body: { test: 'data' },
          query: { page: 1 },
          params: { id: 1 },
          ip: '127.0.0.1',
          headers: { 'user-agent': 'test-agent' },
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as ExecutionContext;

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log successful requests', (done) => {
    const logSpy = jest.spyOn(interceptor['logger'], 'log');
    mockCallHandler.handle = jest.fn(() => of({ data: 'test' }));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      expect(logSpy).toHaveBeenCalledTimes(2); 
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Incoming Request'),
        expect.any(Object),
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Outgoing Response'),
        expect.any(Object),
      );
      done();
    });
  });

  it('should log errors', (done) => {
    const errorSpy = jest.spyOn(interceptor['logger'], 'error');
    const testError = new Error('Test error');
    testError['status'] = 500;
    
    mockCallHandler.handle = jest.fn(() => throwError(() => testError));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: () => {
        expect(errorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Error Response'),
          expect.any(Object),
        );
        done();
      },
    });
  });

  it('should sanitize sensitive data', () => {
    const sensitiveBody = {
      username: 'user',
      password: 'secret123',
      token: 'jwt-token',
    };

    const sanitized = interceptor['sanitizeBody'](sensitiveBody);
    
    expect(sanitized.username).toBe('user');
    expect(sanitized.password).toBe('***REDACTED***');
    expect(sanitized.token).toBe('***REDACTED***');
  });
});

