// src/matchmaking/matchmaking.controller.ts
import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    Param, 
    Delete, 
    HttpException,
    HttpStatus,
    Logger
  } from '@nestjs/common';
  import { MatchmakingService } from './matchmaking.service';
  import { GameSessionService } from './game-session.service';
  import { MatchRequestDto } from './dto/matchmaking.dto';
  
  @Controller('matchmaking')
  export class MatchmakingController {
    private readonly logger = new Logger(MatchmakingController.name);
  
    constructor(
      private readonly matchmakingService: MatchmakingService,
      private readonly gameSessionService: GameSessionService,
    ) {}
  
    @Post('request')
    async requestMatchmaking(@Body() matchRequestDto: MatchRequestDto) {
      try {
        const result = await this.matchmakingService.requestMatchmaking(
          matchRequestDto.playerId,
          matchRequestDto.skillLevel,
          matchRequestDto.preferences,
        );
        return result;
      } catch (error) {
        this.logger.error(`Error requesting matchmaking: ${error.message}`);
        throw new HttpException(
          'Failed to process matchmaking request',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Delete('cancel/:playerId')
    async cancelMatchmaking(@Param('playerId') playerId: string) {
      const cancelled = await this.matchmakingService.cancelMatchmaking(playerId);
      if (!cancelled) {
        throw new HttpException(
          'Player not found in matchmaking queue',
          HttpStatus.NOT_FOUND,
        );
      }
      return { success: true, message: 'Matchmaking cancelled' };
    }
  
    @Get('status')
    getQueueStatus() {
      return this.matchmakingService.getQueueStatus();
    }
  
    @Get('sessions/:playerId')
    async getPlayerSessions(@Param('playerId') playerId: string) {
      try {
        const sessions = await this.gameSessionService.getSessionsByPlayer(playerId);
        return { sessions };
      } catch (error) {
        throw new HttpException(
          'Failed to retrieve player sessions',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Get('session/:sessionId')
    async getSessionDetails(@Param('sessionId') sessionId: string) {
      try {
        const session = await this.gameSessionService.getSession(sessionId);
        return session;
      } catch (error) {
        throw new HttpException(
          'Session not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }
  