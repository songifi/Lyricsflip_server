// src/matchmaking/matchmaking.module.ts
import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { MatchmakingController } from './matchmaking.controller';
import { GameSessionService } from './game-session.service';

@Module({
  controllers: [MatchmakingController],
  providers: [MatchmakingService, GameSessionService],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
