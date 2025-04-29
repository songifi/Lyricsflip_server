// src/matchmaking/test/matchmaking.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingService } from '../matchmaking.service';
import { GameSessionService } from '../game-session.service';
import { 
  PlayerSkillLevel, 
  GameCategory, 
  GameDifficulty 
} from '../types/matchmaking.types';

describe('MatchmakingService', () => {
  let service: MatchmakingService;
  let gameSessionService: GameSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchmakingService,
        {
          provide: GameSessionService,
          useValue: {
            createSession: jest.fn().mockImplementation((playerIds, category, difficulty) => {
              return Promise.resolve('test-session-id');
            }),
            getSession: jest.fn().mockImplementation((sessionId) => {
              return Promise.resolve({
                id: sessionId,
                players: ['player1', 'player2', 'player3', 'player4'],
                category: GameCategory.ACTION,
                difficulty: GameDifficulty.MEDIUM,
                createdAt: new Date(),
                status: 'PENDING',
              });
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MatchmakingService>(MatchmakingService);
    gameSessionService = module.get<GameSessionService>(GameSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestMatchmaking', () => {
    it('should add player to queue if no immediate match', async () => {
      const result = await service.requestMatchmaking(
        'player1',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );

      expect(result.success).toBe(true);
      expect(result.message).toContain('Added to matchmaking queue');
      expect(result.estimatedWaitTime).toBeDefined();
    });

    it('should not add player to queue if already in queue', async () => {
      // Add player first time
      await service.requestMatchmaking(
        'player1',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );

      // Try to add again
      const result = await service.requestMatchmaking(
        'player1',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('already in matchmaking queue');
    });
  });

  describe('cancelMatchmaking', () => {
    it('should remove player from queue', async () => {
      // Add player to queue
      await service.requestMatchmaking(
        'player1',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );

      // Cancel matchmaking
      const result = await service.cancelMatchmaking('player1');
      expect(result).toBe(true);
    });

    it('should return false if player not in queue', async () => {
      const result = await service.cancelMatchmaking('nonexistent-player');
      expect(result).toBe(false);
    });
  });

  describe('processMatchmakingQueue', () => {
    it('should create a session when enough compatible players are in queue', async () => {
      // Add 4 compatible players
      await service.requestMatchmaking(
        'player1',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );
      
      await service.requestMatchmaking(
        'player2',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );
      
      await service.requestMatchmaking(
        'player3',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );
      
      await service.requestMatchmaking(
        'player4',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );

      // Process queue
      await service.processMatchmakingQueue();

      // Check if session was created
      expect(gameSessionService.createSession).toHaveBeenCalled();
    });
  });

  describe('findMatch', () => {
    it('should find match if enough compatible players are available', async () => {
      // Add 3 compatible players to queue first
      await service.requestMatchmaking(
        'player2',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );
      
      await service.requestMatchmaking(
        'player3',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );
      
      await service.requestMatchmaking(
        'player4',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );

      // Try to match a new player
      const result = await service.findMatch({
        playerId: 'player1',
        skillLevel: PlayerSkillLevel.INTERMEDIATE,
        preferences: { categories: [GameCategory.ACTION] },
        requestedAt: new Date(),
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('Match found');
      expect(result.gameSession).toBeDefined();
    });

    it('should not find match if not enough compatible players', async () => {
      // Add only 2 compatible players to queue
      await service.requestMatchmaking(
        'player2',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );
      
      await service.requestMatchmaking(
        'player3',
        PlayerSkillLevel.INTERMEDIATE,
        { categories: [GameCategory.ACTION] }
      );

      // Try to match a new player
      const result = await service.findMatch({
        playerId: 'player1',
        skillLevel: PlayerSkillLevel.INTERMEDIATE,
        preferences: { categories: [GameCategory.ACTION] },
        requestedAt: new Date(),
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('No immediate match available');
    });
  });
});
