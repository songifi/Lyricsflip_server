import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSessionsService } from './game-sessions.service';
import { GameSessionsController } from './game-sessions.controller';
import { GameSession } from './entities/game-session.entity';
import { User } from '../users/entities/user.entity';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameSession, User]), TokensModule],
  controllers: [GameSessionsController],
  providers: [GameSessionsService],
  exports: [GameSessionsService],
})
export class GameSessionsModule {}
