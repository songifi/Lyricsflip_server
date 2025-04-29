import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { PlayerStats } from './leaderboard.entity';
import { LeaderboardEntryDto, LeaderboardQueryDto, PaginatedLeaderboardResponseDto, SortBy, TimePeriod } from './leaderboard.dto';
import * as moment from 'moment';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(PlayerStats)
    private playerStatsRepository: Repository<PlayerStats>,
  ) {}

  async getLeaderboard(queryParams: LeaderboardQueryDto): Promise<PaginatedLeaderboardResponseDto> {
    const { sortBy, timePeriod, page, limit } = queryParams;
    
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.playerStatsRepository.createQueryBuilder('stats');
    
    if (timePeriod !== TimePeriod.ALL) {
      const dateFilter = this.getDateFilterForTimePeriod(timePeriod);
      queryBuilder.where('stats.updatedAt >= :date', { date: dateFilter });
    }
    
    queryBuilder.orderBy(`stats.${sortBy}`, 'DESC');
    
    queryBuilder.skip(skip).take(limit);
    
    const [results, totalItems] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);
    
    const leaderboardEntries = results.map((player, index) => {
      const rank = skip + index + 1;
      return this.mapToLeaderboardEntry(player, rank);
    });
    
    return {
      data: leaderboardEntries,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  private getDateFilterForTimePeriod(period: TimePeriod): Date {
    const now = moment();
    
    switch (period) {
      case TimePeriod.WEEKLY:
        return now.subtract(1, 'week').toDate();
      case TimePeriod.MONTHLY:
        return now.subtract(1, 'month').toDate();
      default:
        return null;
    }
  }

  private mapToLeaderboardEntry(stats: PlayerStats, rank: number): LeaderboardEntryDto {
    return {
      userId: stats.userId,
      username: stats.username,
      totalScore: stats.totalScore,
      gamesPlayed: stats.gamesPlayed,
      wins: stats.wins,
      rank,
    };
  }

  async updatePlayerStats(userId: number, username: string, score: number, won: boolean): Promise<PlayerStats> {
    let playerStats = await this.playerStatsRepository.findOne({ where: { userId } });
    
    if (!playerStats) {
      playerStats = this.playerStatsRepository.create({
        userId,
        username,
        totalScore: 0,
        gamesPlayed: 0,
        wins: 0,
      });
    }
    
    playerStats.totalScore += score;
    playerStats.gamesPlayed += 1;
    if (won) {
      playerStats.wins += 1;
    }
    
    return this.playerStatsRepository.save(playerStats);
  }
}
