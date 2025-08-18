import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, query, params, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(`Incoming Request: ${method} ${url}`, {
      method,
      url,
      body: this.sanitizeBody(body),
      query,
      params,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          const { statusCode } = response;

          // Log successful response
          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${statusCode} - ${responseTime}ms`,
            {
              method,
              url,
              statusCode,
              responseTime: `${responseTime}ms`,
              responseSize: JSON.stringify(responseData).length,
              timestamp: new Date().toISOString(),
            },
          );
        },
        error: (error) => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;
          const statusCode = error.status || 500;

          // Log error response
          this.logger.error(
            `Error Response: ${method} ${url} - ${statusCode} - ${responseTime}ms`,
            {
              method,
              url,
              statusCode,
              responseTime: `${responseTime}ms`,
              error: error.message,
              timestamp: new Date().toISOString(),
            },
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
    ];
    const sanitized = { ...body };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}
