import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistoryService } from './game-history.service';
import { GameHistoryController } from './game-history.controller';
import { GameHistory } from './entities/game-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameHistory])],
  controllers: [GameHistoryController],
  providers: [GameHistoryService],
  exports: [GameHistoryService], // Export service so other modules can use it
})
export class GameHistoryModule { }
