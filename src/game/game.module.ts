import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './game.controller';
import { GameLogicService } from './game.service';
import { Lyrics } from 'src/lyrics/entities/lyrics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lyrics])],
  providers: [GameLogicService],
  controllers: [GameController],
  exports: [GameLogicService],
})
export class GameModule {}
