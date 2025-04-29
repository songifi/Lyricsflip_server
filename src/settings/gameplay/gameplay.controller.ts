import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { GameplayService } from './gameplay.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('gameplay')
@Controller('gameplay')
@UseGuards(JwtAuthGuard)
export class GameplayController {
  constructor(private readonly gameplayService: GameplayService) {}

  @Post('start-session')
  @ApiOperation({ summary: 'Start a new game session applying user preferences' })
  async startSession(@Req() req, @Body() options: any) {
    const userId = req.user.id;
    return this.gameplayService.startGameSession({
      userId,
      ...options
    });
  }
}