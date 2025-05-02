import { BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';

export class AppBadRequestException extends BadRequestException {
  constructor(message = 'Bad Request') {
    super({ success: false, statusCode: 400, message, timestamp: new Date().toISOString() });
  }
}

export class AppNotFoundException extends NotFoundException {
  constructor(message = 'Resource not found') {
    super({ success: false, statusCode: 404, message, timestamp: new Date().toISOString() });
  }
}

export class AppUnauthorizedException extends UnauthorizedException {
  constructor(message = 'Unauthorized') {
    super({ success: false, statusCode: 401, message, timestamp: new Date().toISOString() });
  }
}

export class AppForbiddenException extends ForbiddenException {
  constructor(message = 'Forbidden') {
    super({ success: false, statusCode: 403, message, timestamp: new Date().toISOString() });
  }
}
