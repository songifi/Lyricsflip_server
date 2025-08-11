import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { GameSessionsService } from './game-sessions.service';
import { CreateGameSessionDto } from './dto/create-game-session.dto';
import { UpdateGameSessionDto } from './dto/update-game-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('game-sessions')
@Controller('game-sessions')
@UseGuards(JwtAuthGuard)
export class GameSessionsController {
  constructor(private readonly gameSessionsService: GameSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game session' })
  @ApiResponse({ status: 201, description: 'Game session created.' })
  create(@Body() createGameSessionDto: CreateGameSessionDto, @GetUser() user: User) {
    return this.gameSessionsService.create(createGameSessionDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all game sessions' })
  @ApiResponse({ status: 200, description: 'List of game sessions.' })
  findAll() {
    return this.gameSessionsService.findAll();
  }

  @Get('top-scores')
  @ApiOperation({ summary: 'Get top scores' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Top scores.' })
  getTopScores(@Query('limit') limit: number) {
    return this.gameSessionsService.getTopScores(limit);
  }

  @Get('my-recent')
  @ApiOperation({ summary: 'Get recent games for user' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Recent games for user.' })
  getRecentGames(@GetUser() user: User, @Query('limit') limit: number) {
    return this.gameSessionsService.getRecentGames(user.id, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game session by ID' })
  @ApiResponse({ status: 200, description: 'Game session details.' })
  findOne(@Param('id') id: string) {
    return this.gameSessionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game session' })
  @ApiResponse({ status: 200, description: 'Game session updated.' })
  update(@Param('id') id: string, @Body() updateGameSessionDto: UpdateGameSessionDto) {
    return this.gameSessionsService.update(id, updateGameSessionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game session' })
  @ApiResponse({ status: 200, description: 'Game session deleted.' })
  remove(@Param('id') id: string) {
    return this.gameSessionsService.remove(id);
  }
}
