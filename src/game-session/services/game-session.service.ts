// src/game-session/services/game-session.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GameSessionRepository } from '../repositories/game-session.repository';
import { CreateGameSessionDto } from '../dto/create-game-session.dto';
import { JoinGameSessionDto } from '../dto/join-game-session.dto';
import { UsersService } from '../../users/services/users.service';
import { GameSessionResponseDto } from '../dto/game-session-response.dto';

@Injectable()
export class GameSessionService {
  constructor(
    private gameSessionRepository: GameSessionRepository,
    private usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateGameSessionDto): Promise<GameSessionResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const session = await this.gameSessionRepository.create(user, dto);
    return this.mapToDto(session);
  }

  async joinSession(userId: string, dto: JoinGameSessionDto): Promise<GameSessionResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const session = await this.gameSessionRepository.findById(dto.sessionId);
    if (!session) {
      throw new NotFoundException('Game session not found');
    }
    
    if (session.status !== GameSessionStatus.PENDING) {
      throw new BadRequestException('Cannot join a session that is not in pending status');
    }
    
    if (session.players.length >= session.maxPlayers) {
      throw new BadRequestException('Game session is full');
    }
    
    if (session.isPrivate && session.inviteCode !== dto.inviteCode) {
      throw new ForbiddenException('Invalid invite code');
    }
    
    const updatedSession = await this.gameSessionRepository.addPlayer(session, user);
    return this.mapToDto(updatedSession);
  }

  async startSession(userId: string, sessionId: string): Promise<GameSessionResponseDto> {
    const session = await this.gameSessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Game session not found');
    }
    
    // Check if user is in the session
    const isUserInSession = session.players.some(player => player.id === userId);
    if (!isUserInSession) {
      throw new ForbiddenException('You are not a player in this session');
    }
    
    // Check if creator (first player) is starting the game
    if (session.players[0].id !== userId) {
      throw new ForbiddenException('Only the session creator can start the game');
    }
    
    if (session.players.length < 2) {
      throw new BadRequestException('Need at least 2 players to start a game');
    }
    
    if (session.status !== GameSessionStatus.PENDING) {
      throw new BadRequestException('Game session is already started or completed');
    }
    
    // Start the game
    session.status = GameSessionStatus.ACTIVE;
    session.currentRound = 1;
    
    const updatedSession = await this.gameSessionRepository.update(session);
    return this.mapToDto(updatedSession);
  }

  async getSessionStatus(sessionId: string): Promise<GameSessionResponseDto> {
    const session = await this.gameSessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Game session not found');
    }
    
    return this.mapToDto(session);
  }

  async getPendingSessions(): Promise<GameSessionResponseDto[]> {
    const sessions = await this.gameSessionRepository.findPendingSessions();
    return sessions.map(session => this.mapToDto(session));
  }

  async completeSession(sessionId: string, winnerId: string): Promise<GameSessionResponseDto> {
    const session = await this.gameSessionRepository.updateStatus(
      sessionId, 
      GameSessionStatus.COMPLETED,
      winnerId
    );
    
    return this.mapToDto(session);
  }

  private mapToDto(session: GameSession): GameSessionResponseDto {
    const dto: GameSessionResponseDto = {
      id: session.id,
      players: session.players,
      createdAt: session.createdAt,
      currentRound: session.currentRound,
      winner: session.winner,
      status: session.status,
      maxPlayers: session.maxPlayers,
      isPrivate: session.isPrivate,
    };
    
    // Only include invite code for the owner
    if (session.isPrivate) {
      dto.inviteCode = session.inviteCode;
    }
    
    return dto;
  }
}
