import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 1. Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: '.env',
    }),
    // 2. Configure TypeORM using the loaded environment variables
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
          synchronize: false, // Always false in production

          // --- Query Performance Logging ---
          logging: ['query', 'error'], // Log all queries and errors
          maxQueryExecutionTime: 250, // Log queries that take longer than 250ms

          // --- Connection Pooling Configuration ---
          extra: {
            poolSize: 10,
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
