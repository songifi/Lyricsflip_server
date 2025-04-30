import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GameModeService } from '../services/game-mode.service';
import { GameMode } from '../entities/game-mode.entity';

@Controller('game-modes') // Base route for the game modes
export class GameModeController {
  constructor(private readonly gameModeService: GameModeService) {}

  @Post()
  create(@Body() data: Partial<GameMode>): Promise<GameMode> {
    return this.gameModeService.createGameMode(data);
  }

  @Get()
  findAll(): Promise<GameMode[]> {
    return this.gameModeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<GameMode> {
    return this.gameModeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<GameMode>): Promise<GameMode> {
    return this.gameModeService.updateGameMode(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.gameModeService.deleteGameMode(id);
  }
}