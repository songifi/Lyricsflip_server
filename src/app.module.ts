import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from './users/users.module';
import { LyricsModule } from './lyrics/lyrics.module';
import { AuthModule } from './auth/auth.module';
import { GameSessionsModule } from './game-sessions/game-sessions.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { cacheConfig } from './config/cache.config';

@Module({
  imports: [
    // 1. Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: '.env',
    }),
    // 2. Configure caching globally
    CacheModule.register({
      isGlobal: true,
      ttl: cacheConfig.lyricsTTL,
      max: cacheConfig.maxItems,
    }),
    // 3. Configure TypeORM using the loaded environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Helper to ensure required environment variables are set
        const getRequiredEnv = (key: string): string => {
          const value = configService.get<string>(key);
          if (!value) {
            throw new Error(
              `FATAL ERROR: Environment variable ${key} is not set.`,
            );
          }
          return value;
        };

        // Get primary database credentials, ensuring they exist
        const dbHost = getRequiredEnv('DB_HOST');
        const dbPort = parseInt(getRequiredEnv('DB_PORT'), 10);
        const dbUsername = getRequiredEnv('DB_USERNAME');
        const dbPassword = getRequiredEnv('DB_PASSWORD');
        const dbName = getRequiredEnv('DB_NAME');

        return {
          type: 'postgres',

          // --- Read/Write Splitting Configuration ---
          replication: {
            // Master connection for all write operations
            master: {
              host: dbHost,
              port: dbPort,
              username: dbUsername,
              password: dbPassword,
              database: dbName,
            },
            // Replica connections for all read operations
            slaves: [
              {
                // Use replica-specific variables, or fall back to the primary ones.
                host: configService.get<string>('DB_REPLICA_HOST', dbHost),
                port: configService.get<number>('DB_REPLICA_PORT', dbPort),
                username: configService.get<string>(
                  'DB_REPLICA_USERNAME',
                  dbUsername,
                ),
                password: configService.get<string>(
                  'DB_REPLICA_PASSWORD',
                  dbPassword,
                ),
                database: configService.get<string>('DB_REPLICA_NAME', dbName),
              },
            ],
          },

          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false, 

          // --- Query Performance Logging ---
          // Log all queries and errors
          logging: ['query', 'error'], 
           // Log queries that take longer than 250ms
          maxQueryExecutionTime: 250,

          // --- Connection Pooling Configuration ---
          extra: {
            poolSize: 10,
          },
        };
      },
    }),
    UsersModule,
    AuthModule,
    GameSessionsModule,
  LyricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
    { provide: 'APP_GUARD', useClass: RolesGuard },
  ],
})
export class AppModule {}
