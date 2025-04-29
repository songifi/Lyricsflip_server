import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardQueryDto, PaginatedLeaderboardResponseDto, SortBy, TimePeriod } from './leaderboard.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get global leaderboard' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns paginated leaderboard data', 
    type: PaginatedLeaderboardResponseDto 
  })
  @ApiQuery({ name: 'sortBy', enum: SortBy, required: false })
  @ApiQuery({ name: 'timePeriod', enum: TimePeriod, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getLeaderboard(
    @Query() queryParams: LeaderboardQueryDto,
  ): Promise<PaginatedLeaderboardResponseDto> {
    return this.leaderboardService.getLeaderboard(queryParams);
  }
}
