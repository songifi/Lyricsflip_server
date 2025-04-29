// src/matchmaking/test/matchmaking.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MatchmakingController } from '../matchmaking.controller';
import { MatchmakingService } from '../matchmaking.service';
import { GameSessionService } from '../game-session.service';
import { HttpException } from '@nestjs/common';
import { 
  PlayerSkillLevel, 
  GameCategory, 
  GameDifficulty, 
  GameSessionStatus 
} from '../types/matchmaking.types';

describe('MatchmakingController', () => {
  let controller: MatchmakingController;
  let matchmakingService: MatchmakingService;
  let gameSessionService: GameSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchmakingController],
      providers: [
        {
          provide: MatchmakingService,
          useValue: {
            requestMatchmaking: jest.fn(),
            cancelMatchmaking: jest.fn(),
            getQueueStatus: jest.fn(),
          },
        },
        {
          provide: GameSessionService,
          useValue: {
            getSessionsByPlayer: jest.fn(),
            getSession: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MatchmakingController>(MatchmakingController);
    matchmakingService = module.get<MatchmakingService>(MatchmakingService);
    gameSessionService = module.get<GameSessionService>(GameSessionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestMatchmaking', () => {
    it('should request matchmaking successfully', async () => {
      const matchRequestDto = {
        playerId: 'player1',
        skillLevel: PlayerSkillLevel.INTERMEDIATE,
        preferences: {
          categories: [GameCategory.ACTION],
          difficulty: GameDifficulty.MEDIUM,
        },
      };

      const expectedResult = {
        success: true,
        message: 'Added to matchmaking queue',
        estimatedWaitTime: 30,
      };

      jest.spyOn(matchmakingService, 'requestMatchmaking').mockResolvedValue(expectedResult);

      const result = await controller.requestMatchmaking(matchRequestDto);
      expect(result).toEqual(expectedResult);
      expect(matchmakingService.requestMatchmaking).toHaveBeenCalledWith(
        matchRequestDto.playerId,
        matchRequestDto.skillLevel,
        matchRequestDto.preferences,
      );
    });

    it('should handle errors properly', async () => {
      const matchRequestDto = {
        playerId: 'player1',
        skillLevel: PlayerSkillLevel.INTERMEDIATE,
        preferences: {
          categories: [GameCategory.ACTION],
        },
      };

      jest.spyOn(matchmakingService, 'requestMatchmaking').mockRejectedValue(new Error('Test error'));

      await expect(controller.requestMatchmaking(matchRequestDto)).rejects.toThrow(HttpException);
    });
  });

  describe('cancelMatchmaking', () => {
    it('should cancel matchmaking successfully', async () => {
      jest.spyOn(matchmakingService, 'cancelMatchmaking').mockResolvedValue(true);

      const result = await controller.cancelMatchmaking('player1');
      expect(result).toEqual({ success: true, message: 'Matchmaking cancelled' });
      expect(matchmakingService.cancelMatchmaking).toHaveBeenCalledWith('player1');
    });

    it('should throw exception if player not in queue', async () => {
      jest.spyOn(matchmakingService, 'cancelMatchmaking').mockResolvedValue(false);

      await expect(controller.cancelMatchmaking('player1')).rejects.toThrow(HttpException);
    });
  });

  describe('getQueueStatus', () => {
    it('should return queue status', () => {
      const queueStatus = {
        queueLength: 5,
        queueBySkillLevel: {
          BEGINNER: 1,
          INTERMEDIATE: 2,
          ADVANCED: 1,
          EXPERT: 1,
        },
        averageWaitTime: 45,
      };

      jest.spyOn(matchmakingService, 'getQueueStatus').mockReturnValue(queueStatus);

      const result = controller.getQueueStatus();
      expect(result).toEqual(queueStatus);
    });
  });

  describe('getPlayerSessions', () => {
    it('should return player sessions', async () => {
      const sessions = [
        {
          id: 'session1',
          players: ['player1', 'player2', 'player3', 'player4'],
          category: GameCategory.ACTION,
          difficulty: GameDifficulty.MEDIUM,
          createdAt: new Date(),
          status: GameSessionStatus.ACTIVE,
        },
      ];

      jest.spyOn(gameSessionService, 'getSessionsByPlayer').mockResolvedValue(sessions);

      const result = await controller.getPlayerSessions('player1');
      expect(result).toEqual({ sessions });
      expect(gameSessionService.getSessionsByPlayer).toHaveBeenCalledWith('player1');
    });

    it('should handle errors properly', async () => {
      jest.spyOn(gameSessionService, 'getSessionsByPlayer').mockRejectedValue(new Error('Test error'));

      await expect(controller.getPlayerSessions('player1')).rejects.toThrow(HttpException);
    });
  });

  describe('getSessionDetails', () => {
    it('should return session details', async () => {
      const session = {
        id: 'session1',
        players: ['player1', 'player2', 'player3', 'player4'],
        category: GameCategory.ACTION,
        difficulty: GameDifficulty.MEDIUM,
        createdAt: new Date(),
        status: GameSessionStatus.ACTIVE,
      };

      jest.spyOn(gameSessionService, 'getSession').mockResolvedValue(session);

      const result = await controller.getSessionDetails('session1');
      expect(result).toEqual(session);
      expect(gameSessionService.getSession).toHaveBeenCalledWith('session1');
    });

    it('should handle errors properly', async () => {
      jest.spyOn(gameSessionService, 'getSession').mockRejectedValue(new Error('Test error'));

      await expect(controller.getSessionDetails('session1')).rejects.toThrow(HttpException);
    });
  });
});
