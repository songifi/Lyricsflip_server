import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { PlayerStats } from './leaderboard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerStats])],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})

export class LeaderboardModule {}
