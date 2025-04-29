// src/game-session/tests/game-session.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionService } from '../services/game-session.service';
import { GameSessionRepository } from '../repositories/game-session.repository';
import { UsersService } from '../../users/services/users.service';
import { GameSessionStatus } from '../entities/game-session.entity';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

describe('GameSessionService', () => {
  let service: GameSessionService;
  let repository: GameSessionRepository;
  let usersService: UsersService;

  const mockUser = { id: '1', username: 'testuser' };
  const mockSession = {
    id: '123',
    players: [mockUser],
    status: GameSessionStatus.PENDING,
    maxPlayers: 4,
    isPrivate: false,
    createdAt: new Date(),
    currentRound: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameSessionService,
        {
          provide: GameSessionRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findPendingSessions: jest.fn(),
            addPlayer: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameSessionService>(GameSessionService);
    repository = module.get<GameSessionRepository>(GameSessionRepository);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a new game session', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(repository, 'create').mockResolvedValue(mockSession as any);

      const result = await service.create('1', {});
      
      expect(usersService.findById).toHaveBeenCalledWith('1');
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        id: '123',
        status: GameSessionStatus.PENDING,
      }));
    });

    it('should throw if user not found', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(null);
      
      await expect(service.create('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('joinSession', () => {
    it('should allow user to join a session', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(repository, 'findById').mockResolvedValue(mockSession as any);
      jest.spyOn(repository, 'addPlayer').mockResolvedValue({
        ...mockSession,
        players: [...mockSession.players, { id: '2', username: 'player2' }],
      } as any);

      const result = await service.joinSession('2', { sessionId: '123' });
      
      expect(repository.addPlayer).toHaveBeenCalled();
      expect(result.players.length).toBe(2);
    });

    it('should throw if session is full', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(repository, 'findById').mockResolvedValue({
        ...mockSession,
        players: Array(4).fill(mockUser),
        maxPlayers: 4,
      } as any);
      
      await expect(service.joinSession('2', { sessionId: '123' }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('startSession', () => {
    it('should start a game session', async () => {
      const sessionWithTwoPlayers = {
        ...mockSession,
        players: [mockUser, { id: '2', username: 'player2' }],
      };
      
      jest.spyOn(repository, 'findById').mockResolvedValue(sessionWithTwoPlayers as any);

      const startedSession = {
        ...sessionWithTwoPlayers,
        status: GameSessionStatus.ACTIVE,
        currentRound: 1,
      };
      
      jest.spyOn(repository, 'update').mockResolvedValue(startedSession as any);

      const result = await service.startSession('1', '123');
      
      expect(repository.update).toHaveBeenCalled();
      expect(result.status).toBe(GameSessionStatus.ACTIVE);
      expect(result.currentRound).toBe(1);
    });

    it('should throw if not enough players', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(mockSession as any);
      
      await expect(service.startSession('1', '123'))
        .rejects.toThrow(BadRequestException);
    });
  });
});
