import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
          const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level}]: ${message} ${stack || ''} ${metaString}`;
        }),
      ),
      transports: [
        // Console transport
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
        }),
        
        new DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info',
        }),
        
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
        }),
      ],
    });

    this.logger.exceptions.handle(
      new winston.transports.File({ filename: 'logs/exceptions.log' }),
    );
    this.logger.rejections.handle(
      new winston.transports.File({ filename: 'logs/rejections.log' }),
    );
  }

  log(message: string, context?: any) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: any) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: any) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: any) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: any) {
    this.logger.verbose(message, { context });
  }

  logRequest(method: string, url: string, statusCode: number, responseTime: number, meta?: any) {
    this.logger.info('Request completed', {
      method,
      url,
      statusCode,
      responseTime,
      ...meta,
    });
  }

  logError(error: Error, context?: any) {
    this.logger.error(error.message, {
      stack: error.stack,
      name: error.name,
      context,
    });
  }

  logDatabaseQuery(query: string, duration: number, context?: any) {
    this.logger.debug('Database query executed', {
      query: query.substring(0, 200), 
      duration,
      context,
    });
  }
}

