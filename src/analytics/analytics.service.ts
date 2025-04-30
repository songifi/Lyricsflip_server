import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSession } from './entities/game-session.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(GameSession) private sessionRepo: Repository<GameSession>,
  ) {}

  public async getTotalGamesPlayed(from?: Date, to?: Date): Promise<number> {
    const where: FindOptionsWhere<GameSession> = {};
    if (from && to) where.playedAt = Between(from, to);
    return this.sessionRepo.count({ where });
  }

  public async getTopSongsPlayed(
    limit = 5,
    category?: string,
  ): Promise<{ songId: number; count: number }[]> {
    const qb = this.sessionRepo
      .createQueryBuilder('session')
      .select('session.songId', 'songId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('session.songId')
      .orderBy('count', 'DESC')
      .limit(limit);

    if (category) qb.where('session.category = :category', { category });

    return qb.getRawMany();
  }

  public async getAveragePlayerScores(from?: Date, to?: Date): Promise<number> {
    const qb = this.sessionRepo
      .createQueryBuilder('session')
      .select('AVG(session.score)', 'avg');

    if (from && to)
      qb.where('session.playedAt BETWEEN :from AND :to', { from, to });

    const result = await qb.getRawOne();
    return parseFloat(result.avg) || 0;
  }

  public async getActiveUsersCount(from?: Date, to?: Date): Promise<number> {
    const qb = this.sessionRepo
      .createQueryBuilder('session')
      .select('COUNT(DISTINCT session.userId)', 'count');

    if (from && to)
      qb.where('session.playedAt BETWEEN :from AND :to', { from, to });

    const result = await qb.getRawOne();
    return parseInt(result.count, 10) || 0;
  }

  public async getLeaderboard(
    limit = 10,
    category?: string,
  ): Promise<{ userId: number; totalScore: number }[]> {
    const qb = this.sessionRepo
      .createQueryBuilder('session')
      .select('session.userId', 'userId')
      .addSelect('SUM(session.score)', 'totalScore')
      .groupBy('session.userId')
      .orderBy('totalScore', 'DESC')
      .limit(limit);

    if (category) qb.where('session.category = :category', { category });

    return qb.getRawMany();
  }
}
