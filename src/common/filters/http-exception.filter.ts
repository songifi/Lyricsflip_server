import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let error = null;
  
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const res = exception.getResponse();
        if (typeof res === 'string') {
          message = res;
        } else if (typeof res === 'object') {
          const resObj = res as Record<string, any>;
          message = resObj.message || message;
          error = resObj.error || null;
        }
      }
  
      response.status(status).json({
        success: false,
        statusCode: status,
        message,
        error,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }
  }
  