import { Controller, Get, Query } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('total-games')
  getTotalGames(@Query('from') from: string, @Query('to') to: string) {
    return this.analyticsService.getTotalGamesPlayed(
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Get('top-songs')
  getTopSongs(
    @Query('limit') limit: string,
    @Query('category') category?: string,
  ) {
    return this.analyticsService.getTopSongsPlayed(
      limit ? parseInt(limit) : 5,
      category,
    );
  }

  @Get('average-scores')
  getAverageScores(@Query('from') from: string, @Query('to') to: string) {
    return this.analyticsService.getAveragePlayerScores(
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Get('active-users')
  getActiveUsers(@Query('from') from: string, @Query('to') to: string) {
    return this.analyticsService.getActiveUsersCount(
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Get('leaderboard')
  getLeaderboard(
    @Query('limit') limit: string,
    @Query('category') category?: string,
  ) {
    return this.analyticsService.getLeaderboard(
      limit ? parseInt(limit) : 10,
      category,
    );
  }
}
