// src/game-session/controllers/game-session.controller.ts
import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    Post, 
    UseGuards, 
    Request,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { GameSessionService } from '../services/game-session.service';
  import { CreateGameSessionDto } from '../dto/create-game-session.dto';
  import { JoinGameSessionDto } from '../dto/join-game-session.dto';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { GameSessionResponseDto } from '../dto/game-session-response.dto';
  
  @Controller('game-sessions')
  @UseGuards(JwtAuthGuard)
  export class GameSessionController {
    constructor(private readonly gameSessionService: GameSessionService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Request() req,
      @Body() createGameSessionDto: CreateGameSessionDto,
    ): Promise<GameSessionResponseDto> {
      return this.gameSessionService.create(req.user.id, createGameSessionDto);
    }
  
    @Post('join')
    @HttpCode(HttpStatus.OK)
    async join(
      @Request() req,
      @Body() joinGameSessionDto: JoinGameSessionDto,
    ): Promise<GameSessionResponseDto> {
      return this.gameSessionService.joinSession(req.user.id, joinGameSessionDto);
    }
  
    @Post(':id/start')
    @HttpCode(HttpStatus.OK)
    async start(
      @Request() req,
      @Param('id') id: string,
    ): Promise<GameSessionResponseDto> {
      return this.gameSessionService.startSession(req.user.id, id);
    }
  
    @Get(':id')
    async getById(@Param('id') id: string): Promise<GameSessionResponseDto> {
      return this.gameSessionService.getSessionStatus(id);
    }
  
    @Get()
    async getPendingSessions(): Promise<GameSessionResponseDto[]> {
      return this.gameSessionService.getPendingSessions();
    }
  }
  