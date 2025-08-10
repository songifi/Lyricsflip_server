import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { GameSessionsService } from './game-sessions.service';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { UpdateGameSessionDto } from './dto/update-game-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('game-sessions')
@UseGuards(JwtAuthGuard)
export class GameSessionsController {
  constructor(private readonly gameSessionsService: GameSessionsService) {}

  @Post()
  create(@Body() createGameSessionDto: CreateGameSessionDto, @GetUser() user: User) {
    return this.gameSessionsService.create(createGameSessionDto, user);
  }

  @Get()
  findAll() {
    return this.gameSessionsService.findAll();
  }

  @Get('top-scores')
  getTopScores(@Query('limit') limit: number) {
    return this.gameSessionsService.getTopScores(limit);
  }

  @Get('my-recent')
  getRecentGames(@GetUser() user: User, @Query('limit') limit: number) {
    return this.gameSessionsService.getRecentGames(user.id, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameSessionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameSessionDto: UpdateGameSessionDto) {
    return this.gameSessionsService.update(id, updateGameSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameSessionsService.remove(id);
  }
}
