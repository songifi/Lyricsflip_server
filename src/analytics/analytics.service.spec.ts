import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameSession } from './entities/game-session.entity';

const mockRepo = () => ({
  count: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
  })),
});

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let repo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: getRepositoryToken(GameSession), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    repo = module.get(getRepositoryToken(GameSession));
  });

  describe('getTotalGamesPlayed', () => {
    it('should return total games played', async () => {
      repo.count.mockResolvedValue(50);
      const result = await service.getTotalGamesPlayed();
      expect(result).toBe(50);
    });
  });

  describe('getTopSongsPlayed', () => {
    it('should return top songs', async () => {
      const mockData = [{ songId: 1, count: 10 }];
      repo.createQueryBuilder().getRawMany.mockResolvedValue(mockData);
      const result = await service.getTopSongsPlayed(5);
      expect(result).toEqual(mockData);
    });
  });

  describe('getAveragePlayerScores', () => {
    it('should return average score', async () => {
      repo.createQueryBuilder().getRawOne.mockResolvedValue({ avg: '87.5' });
      const result = await service.getAveragePlayerScores();
      expect(result).toBe(87.5);
    });

    it('should return 0 if no results', async () => {
      repo.createQueryBuilder().getRawOne.mockResolvedValue({ avg: null });
      const result = await service.getAveragePlayerScores();
      expect(result).toBe(0);
    });
  });

  describe('getActiveUsersCount', () => {
    it('should return number of active users', async () => {
      repo.createQueryBuilder().getRawOne.mockResolvedValue({ count: '12' });
      const result = await service.getActiveUsersCount();
      expect(result).toBe(12);
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard scores', async () => {
      const mockLeaderboard = [{ userId: 1, totalScore: 300 }];
      repo.createQueryBuilder().getRawMany.mockResolvedValue(mockLeaderboard);
      const result = await service.getLeaderboard(10);
      expect(result).toEqual(mockLeaderboard);
    });
  });
});
