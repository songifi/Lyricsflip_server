// src/matchmaking/game-session.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { GameSession, GameSessionStatus, GameCategory, GameDifficulty } from './types/matchmaking.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameSessionService {
  private readonly logger = new Logger(GameSessionService.name);
  private sessions: Map<string, GameSession> = new Map();

  async createSession(
    playerIds: string[],
    category: GameCategory,
    difficulty: GameDifficulty,
  ): Promise<string> {
    const sessionId = uuidv4();
    
    const session: GameSession = {
      id: sessionId,
      players: playerIds,
      category,
      difficulty,
      createdAt: new Date(),
      status: GameSessionStatus.PENDING,
    };
    
    this.sessions.set(sessionId, session);
    this.logger.log(`Created game session ${sessionId} with ${playerIds.length} players`);
    
    return sessionId;
  }

  async getSession(sessionId: string): Promise<GameSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Game session ${sessionId} not found`);
    }
    return session;
  }

  async updateSessionStatus(sessionId: string, status: GameSessionStatus): Promise<GameSession> {
    const session = await this.getSession(sessionId);
    session.status = status;
    this.sessions.set(sessionId, session);
    return session;
  }

  async getSessionsByPlayer(playerId: string): Promise<GameSession[]> {
    const playerSessions: GameSession[] = [];
    
    for (const session of this.sessions.values()) {
      if (session.players.includes(playerId)) {
        playerSessions.push(session);
      }
    }
    
    return playerSessions;
  }
}
