// src/game-session/tests/game-session.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionController } from '../controllers/game-session.controller';
import { GameSessionService } from '../services/game-session.service';

describe('GameSessionController', () => {
  let controller: GameSessionController;
  let service: GameSessionService;

  const mockUser = { id: '1', username: 'testuser' };
  const mockGameSession = {
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
      controllers: [GameSessionController],
      providers: [
        {
          provide: GameSessionService,
          useValue: {
            create: jest.fn(),
            joinSession: jest.fn(),
            startSession: jest.fn(),
            getSessionStatus: jest.fn(),
            getPendingSessions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GameSessionController>(GameSessionController);
    service = module.get<GameSessionService>(GameSessionService);
  });

  describe('create', () => {
    it('should create a new game session', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockGameSession as any);
      
      const result = await controller.create(
        { user: { id: '1' } },
        { maxPlayers: 4 }
      );
      
      expect(service.create).toHaveBeenCalledWith('1', { maxPlayers: 4 });
      expect(result).toEqual(mockGameSession);
    });
  });

  describe('join', () => {
    it('should join a game session', async () => {
      jest.spyOn(service, 'joinSession').mockResolvedValue(mockGameSession as any);
      
      const result = await controller.join(
        { user: { id: '1' } },
        { sessionId: '123' }
      );
      
      expect(service.joinSession).toHaveBeenCalledWith('1', { sessionId: '123' });
      expect(result).toEqual(mockGameSession);
    });
  });

  describe('start', () => {
    it('should start a game session', async () => {
      const startedSession = {
        ...mockGameSession,
        status: GameSessionStatus.ACTIVE,
        currentRound: 1,
      };
      
      jest.spyOn(service, 'startSession').mockResolvedValue(startedSession as any);
      
      const result = await controller.start({ user: { id: '1' } }, '123');
      
      expect(service.startSession).toHaveBeenCalledWith('1', '123');
      expect(result).toEqual(startedSession);
    });
  });
});
