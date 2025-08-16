import { Test } from '@nestjs/testing';
import { ErrorInterceptor } from './error.interceptor';
import { ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ErrorInterceptor],
    }).compile();

    interceptor = module.get<ErrorInterceptor>(ErrorInterceptor);

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          url: '/test',
          body: { test: 'data' },
          query: {},
          params: {},
          ip: '127.0.0.1',
          headers: { 'user-agent': 'test-agent' },
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

  it('should not intercept successful requests', (done) => {
    mockCallHandler.handle = jest.fn(() => of({ data: 'success' }));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result) => {
      expect(result).toEqual({ data: 'success' });
      done();
    });
  });

  it('should format HTTP exceptions', (done) => {
    const httpException = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    mockCallHandler.handle = jest.fn(() => throwError(() => httpException));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(HttpException);
        const response = error.getResponse() as any;
        expect(response.statusCode).toBe(404);
        expect(response.error).toBe('Not Found');
        expect(response.timestamp).toBeDefined();
        expect(response.path).toBe('/test');
        expect(response.method).toBe('POST');
        done();
      },
    });
  });

  it('should format validation errors', (done) => {
    const validationError = {
      name: 'ValidationError',
      errors: [{ message: 'Field is required' }],
    };
    mockCallHandler.handle = jest.fn(() => throwError(() => validationError));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: (error) => {
        const response = error.getResponse() as any;
        expect(response.statusCode).toBe(400);
        expect(response.message).toEqual(['Field is required']);
        expect(response.error).toBe('Bad Request');
        done();
      },
    });
  });

  it('should format database errors', (done) => {
    const dbError = {
      name: 'QueryFailedError',
      code: '23505',
      message: 'Duplicate key error',
    };
    mockCallHandler.handle = jest.fn(() => throwError(() => dbError));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: (error) => {
        const response = error.getResponse() as any;
        expect(response.statusCode).toBe(409);
        expect(response.error).toBe('Conflict');
        done();
      },
    });
  });

  it('should handle unknown errors', (done) => {
    const unknownError = new Error('Unknown error');
    mockCallHandler.handle = jest.fn(() => throwError(() => unknownError));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: (error) => {
        const response = error.getResponse() as any;
        expect(response.statusCode).toBe(500);
        expect(response.error).toBe('Internal Server Error');
        done();
      },
    });
  });

  it('should log errors appropriately', (done) => {
    const errorSpy = jest.spyOn(interceptor['logger'], 'error');
    const testError = new Error('Test error');
    mockCallHandler.handle = jest.fn(() => throwError(() => testError));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: () => {
        expect(errorSpy).toHaveBeenCalledWith(
          expect.stringContaining('🔥 Error occurred'),
          expect.any(Object),
        );
        done();
      },
    });
  });
});