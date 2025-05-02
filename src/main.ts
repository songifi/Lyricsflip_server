// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global Validation Pipe (already good)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ Register Global SuccessResponseInterceptor
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  // ✅ Register Global HttpExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
