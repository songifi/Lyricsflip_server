// src/game-session/game-session.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSession } from './entities/game-session.entity';
import { GameSessionController } from './controllers/game-session.controller';
import { GameSessionService } from './services/game-session.service';
import { GameSessionRepository } from './repositories/game-session.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameSession]),
    UsersModule,
  ],
  controllers: [GameSessionController],
  providers: [GameSessionService, GameSessionRepository],
  exports: [GameSessionService],
})
export class GameSessionModule {}