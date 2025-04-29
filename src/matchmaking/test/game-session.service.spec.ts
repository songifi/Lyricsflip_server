// src/matchmaking/test/game-session.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionService } from '../game-session.service';
import { GameCategory, GameDifficulty, GameSessionStatus } from '../types/matchmaking.types';

describe('GameSessionService', () => {
  let service: GameSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameSessionService],
    }).compile();

    service = module.get<GameSessionService>(GameSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    it('should create a new game session', async () => {
      const playerIds = ['player1', 'player2', 'player3', 'player4'];
      const category = GameCategory.ACTION;
      const difficulty = GameDifficulty.MEDIUM;

      const sessionId = await service.createSession(playerIds, category, difficulty);
      expect(sessionId).toBeDefined();

      const session = await service.getSession(sessionId);
      expect(session).toEqual(expect.objectContaining({
        id: sessionId,
        players: playerIds,
        category,
        difficulty,
        status: GameSessionStatus.PENDING,
      }));
    });
  });

  describe('getSession', () => {
    it('should retrieve an existing session', async () => {
      const playerIds = ['player1', 'player2', 'player3', 'player4'];
      const sessionId = await service.createSession(
        playerIds, 
        GameCategory.ACTION, 
        GameDifficulty.MEDIUM
      );

      const session