import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { map, Observable } from 'rxjs';
  
  @Injectable()
  export class SuccessResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          return {
            success: true,
            statusCode: context.switchToHttp().getResponse().statusCode,
            data,
            timestamp: new Date().toISOString(),
          };
        }),
      );
    }
  }
  