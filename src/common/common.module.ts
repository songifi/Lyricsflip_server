// import { Module, Global } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { LoggingInterceptor } from './interceptors/logging.interceptor';
// import { ErrorInterceptor } from './interceptors/error.interceptor';

// @Global()
// @Module({
//   providers: [
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: LoggingInterceptor,
//     },
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: ErrorInterceptor,
//     },
//   ],
//   exports: [LoggingInterceptor, ErrorInterceptor],
// })
// export class CommonModule {}
