import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameMode } from './entities/game-mode.entity';
import { GameModeController } from './controllers/game-mode.controller';
import { GameModeService } from './services/game-mode.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameMode])], 
  controllers: [GameModeController],               
  providers: [GameModeService],  
  exports: [GameModeService],                  
})
export class GameModeModule {}